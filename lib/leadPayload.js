import { randomUUID } from "crypto";
import { z } from "zod";
import { phoneDigitsOnly, toE164Us } from "./phone";

export const leadSchema = z.object({
  salesBackground: z.enum(["yes_professional", "yes_some", "no"]),
  investmentParticipation: z.enum(["active", "passive", "either"]),
  investmentTimeline: z.enum([
    "0_3_months",
    "3_6_months",
    "6_12_months",
    "12_plus",
  ]),
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

/** Standard JSON shape for GHL inbound webhook mapping (stage 1 — qualification) */
export function buildLeadPayload(data) {
  const eventId = randomUUID();
  const tags = [
    "facebook-funnel",
    "investor-funnel",
    "solve-energy",
    "stage-qualification",
  ];

  if (data.investmentTimeline === "0_3_months") {
    tags.push("timeline-hot-0-3mo");
  }
  if (data.investmentParticipation === "active") {
    tags.push("investor-active-participant");
  }

  const tracking = data.tracking || {};

  return {
    source: "Facebook Survey Funnel",
    funnel: "invest.solveenergy.ca",
    stage: "qualification",
    event_id: eventId,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: toE164Us(data.phone) ?? data.phone,
    },
    survey: {
      sales_background: data.salesBackground,
      investment_participation: data.investmentParticipation,
      investment_timeline: data.investmentTimeline,
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
      submitted_at: new Date().toISOString(),
    },
  };
}
