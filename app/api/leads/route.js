import { buildLeadPayload, leadSchema } from "@/lib/leadPayload";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website?.trim()) {
    return Response.json({ error: "Invalid submission" }, { status: 400 });
  }

  const webhookUrl = process.env.GHL_INBOUND_WEBHOOK_URL;
  const payload = buildLeadPayload(parsed.data);

  if (!webhookUrl) {
    console.warn("[leads] GHL_INBOUND_WEBHOOK_URL not set — logging payload only");
    console.info(JSON.stringify(payload, null, 2));
    return Response.json({
      ok: true,
      forwarded: false,
      eventId: payload.meta.event_id,
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[leads] GHL webhook failed", response.status, text);
      return Response.json(
        { error: "Unable to save your response. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({
      ok: true,
      forwarded: true,
      eventId: payload.meta.event_id,
    });
  } catch (err) {
    console.error("[leads] GHL webhook error", err);
    return Response.json(
      { error: "Unable to save your response. Please try again." },
      { status: 502 },
    );
  }
}
