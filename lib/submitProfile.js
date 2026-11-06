import { getTracking } from "./tracking";

export async function submitProfile(form) {
  const body = {
    ...form,
    tracking: getTracking(),
    website: form.website ?? "",
  };

  const res = await fetch("/api/leads/profile", {
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
