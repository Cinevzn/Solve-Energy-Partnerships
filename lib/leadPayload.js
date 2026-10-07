import { randomUUID } from "crypto";
import { z } from "zod";
import { phoneDigitsOnly, toE164Us } from "./phone";

export const TAX_LIABILITY_VALUES = ["20-50k", "50-100k", "100-200k", "200k+"];

const SUB_100K_LIABILITY = new Set(["20-50k", "50-100k"]);

export const leadSchema = z.object({
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
        .length(10, "Enter a valid 10-digit US phone number")
        .regex(/^\d+$/, "Phone number cannot contain letters"),
    ),
  taxLiability2026: z.enum(["20-50k", "50-100k", "100-200k", "200k+"]),
  paidTaxes2023_2025: z.enum(["yes", "no"]),
  incomeType: z.enum([
    "corporate",
    "passive",
    "active",
    "capital_gains",
    "other",
  ]),
  accreditedInvestor: z.enum(["yes", "no", "not_sure"]),
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

/** Standard JSON shape for GHL inbound webhook mapping */
export function buildLeadPayload(data) {
  const eventId = randomUUID();
  const tags = ["facebook-funnel", "partners-survey"];

  if (SUB_100K_LIABILITY.has(data.taxLiability2026)) {
    tags.push("sub-100k-liability");
  }

  const tracking = data.tracking || {};

  return {
    source: "Facebook Survey Funnel",
    funnel: "partners.taxequityprofessionals.info",
    event_id: eventId,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: toE164Us(data.phone) ?? data.phone,
    },
    survey: {
      tax_liability_2026: data.taxLiability2026,
      paid_taxes_2023_2025: data.paidTaxes2023_2025,
      income_type: data.incomeType,
      accredited_investor: data.accreditedInvestor,
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
