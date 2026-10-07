import { getTracking } from "./tracking.js";

export async function submitLead(form) {
  const body = {
    ...form,
    tracking: getTracking(),
    website: form.website ?? "",
  };

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}
