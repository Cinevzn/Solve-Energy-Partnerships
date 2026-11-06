import { randomUUID } from "crypto";
import { z } from "zod";
import { phoneDigitsOnly, toE164Us } from "./phone";

export const profileSchema = z.object({
  parentEventId: z.string().uuid(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  phone: z
    .string()
    .trim()
    .transform((val) => phoneDigitsOnly(val))
    .pipe(
      z
        .string()
        .length(10, "Enter a valid 10-digit phone number")
        .regex(/^\d+$/, "Phone number cannot contain letters"),
    ),
  location: z.string().trim().min(1).max(200),
  willingToRelocate: z.enum(["yes", "no", "open_to_discuss", "remote_only"]),
  investorBackground: z.string().trim().min(20).max(4000),
  tracking: z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
      utm_content: z.string().max(200).optional(),
      utm_term: z.string().max(200).optional(),
      fbclid: z.string().max(500).optional(),
    })
    .optional()
    .default({}),
  website: z.string().optional(),
});

/** GHL inbound webhook — stage 2 investor profile (updates same contact) */
export function buildProfilePayload(data) {
  const eventId = randomUUID();
  const tags = [
    "facebook-funnel",
    "investor-funnel",
    "solve-energy",
    "stage-investor-profile",
    "profile-complete",
  ];

  if (data.willingToRelocate === "yes") {
    tags.push("willing-relocate-yes");
  }

  const tracking = data.tracking || {};

  return {
    source: "Facebook Survey Funnel",
    funnel: "invest.solveenergy.ca",
    stage: "investor_profile",
    event_id: eventId,
    parent_event_id: data.parentEventId,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: toE164Us(data.phone) ?? data.phone,
    },
    survey: {
      location: data.location,
      willing_to_relocate: data.willingToRelocate,
      investor_background: data.investorBackground,
    },
    tracking: {
      utm_source: tracking.utm_source ?? "",
      utm_medium: tracking.utm_medium ?? "",
      utm_campaign: tracking.utm_campaign ?? "",
      utm_content: tracking.utm_content ?? "",
      utm_term: tracking.utm_term ?? "",
      fbclid: tracking.fbclid ?? "",
    },
    tags,
    meta: {
      event_id: eventId,
      parent_event_id: data.parentEventId,
      submitted_at: new Date().toISOString(),
    },
  };
}
