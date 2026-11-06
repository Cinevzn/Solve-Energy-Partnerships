import { getTracking } from "./tracking";

function normalizeQuestionnaireBody(body) {
  const emptyToUndef = (v) => (v === "" ? undefined : v);
  return {
    ...body,
    q9PeopleResponsible: emptyToUndef(body.q9PeopleResponsible),
    q10DayToDayOwn: emptyToUndef(body.q10DayToDayOwn),
    q9InvolvementLevel: emptyToUndef(body.q9InvolvementLevel),
    tracking: getTracking(),
    website: body.website ?? "",
  };
}

export async function submitQuestionnaire(body) {
  const { phone, ...rest } = body;
  const payload = normalizeQuestionnaireBody(rest);

  const res = await fetch("/api/questionnaire", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const flat = data.details && typeof data.details === "object" ? data.details : null;
    const parts = flat
      ? Object.values(flat)
          .flat()
          .filter((x) => typeof x === "string" && x.trim())
      : [];
    const msg = parts.length ? parts.join(" ") : data.error || "Something went wrong. Please try again.";
    throw new Error(msg);
  }

  return data;
}
