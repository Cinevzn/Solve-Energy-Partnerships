import { randomUUID } from "crypto";
import { z } from "zod";
import { phoneDigitsOnly, toE164Us } from "./phone";

export const leadSchema = z.object({
  marketInterest: z.enum([
    "calgary_ab",
    "edmonton_ab",
    "red_deer_ab",
    "lethbridge_ab",
    "grande_prairie_ab",
    "saskatoon_sk",
    "regina_sk",
    "winnipeg_mb",
    "toronto_on",
    "ottawa_on",
    "kingston_on",
    "windsor_on",
    "sudbury_on",
    "montreal_qc",
    "quebec_city_qc",
    "new_brunswick",
    "halifax_ns",
    "st_johns_nl",
    "other_city",
  ]),
  participationModel: z.enum([
    "hands_on_run_market",
    "invest_solve_team",
    "unsure_both",
  ]),
  basedNear: z.enum(["live_in_market", "within_hour", "would_relocate", "remote"]),
  capitalAvailable: z.enum([
    "under_250k",
    "250k_500k",
    "500k_750k",
    "750k_1m",
    "1m_plus",
  ]),
  ownCapital: z.enum([
    "mine_liquid_now",
    "mine_sell_or_borrow",
    "raise_from_others",
    "not_sure_yet",
  ]),
  investTimeline: z.enum([
    "ready_now",
    "within_three_months",
    "three_to_six_months",
    "still_exploring",
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
  aboutYou: z
    .string()
    .trim()
    .min(1, "Please tell us about yourself")
    .max(2000),
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
  surveyVersion: z.enum(["v1", "v2"]).optional().default("v1"),
});

/** GHL inbound webhook JSON (single survey + contact) */
export function buildLeadPayload(data) {
  const eventId = randomUUID();
  const tags = ["facebook-funnel", "investor-funnel", "solve-energy", "market-expansion"];

  if (data.surveyVersion === "v2") {
    tags.push("survey-v2-map");
  }

  if (data.investTimeline === "ready_now") {
    tags.push("timeline-ready-now");
  }
  if (data.participationModel === "hands_on_run_market") {
    tags.push("hands-on-market");
  }
  if (data.capitalAvailable === "750k_1m" || data.capitalAvailable === "1m_plus") {
    tags.push("capital-750k-plus");
  }

  const tracking = data.tracking || {};

  return {
    source: "Facebook Survey Funnel",
    funnel: "invest.solveenergy.ca",
    stage: "survey",
    event_id: eventId,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: toE164Us(data.phone) ?? data.phone,
    },
    survey: {
      survey_version: data.surveyVersion ?? "v1",
      market_interest: data.marketInterest,
      participation_model: data.participationModel,
      based_near: data.basedNear,
      capital_available: data.capitalAvailable,
      own_capital: data.ownCapital,
      invest_timeline: data.investTimeline,
      about_you: data.aboutYou.trim(),
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
