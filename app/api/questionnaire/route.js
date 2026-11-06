import { buildQuestionnairePayload, questionnaireSchema } from "@/lib/questionnairePayload";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = questionnaireSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return Response.json(
      {
        error: "Validation failed",
        details: flat.fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website?.trim()) {
    return Response.json({ error: "Invalid submission" }, { status: 400 });
  }

  const webhookUrl = process.env.GHL_QUESTIONNAIRE_WEBHOOK_URL ?? process.env.GHL_INBOUND_WEBHOOK_URL;
  const payload = buildQuestionnairePayload(parsed.data);

  if (!webhookUrl) {
    console.warn(
      "[questionnaire] No webhook (set GHL_QUESTIONNAIRE_WEBHOOK_URL or GHL_INBOUND_WEBHOOK_URL); logging payload only",
    );
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
      console.error("[questionnaire] webhook failed", response.status, text);
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
    console.error("[questionnaire] webhook error", err);
    return Response.json(
      { error: "Unable to save your response. Please try again." },
      { status: 502 },
    );
  }
}
