import { randomUUID } from "crypto";
import { z } from "zod";
import { phoneDigitsOnly, toE164Us } from "./phone";

export const leadSchema = z.object({
  businessName: z.string().trim().min(1).max(120),
  businessType: z.enum([
    "convenience_store",
    "online_store",
    "distributor",
    "other",
  ]),
  storeCount: z.enum(["1", "2-5", "5-10", "10+"]),
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
  const tags = ["facebook-funnel", "b2b-wholesale", "smokeshop-survey"];

  if (data.storeCount === "10+") {
    tags.push("multi-store-10-plus");
  }

  const tracking = data.tracking || {};

  return {
    source: "Facebook Survey Funnel",
    funnel: "b2b.ktropix.com",
    event_id: eventId,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: toE164Us(data.phone) ?? data.phone,
      companyName: data.businessName,
    },
    survey: {
      business_name: data.businessName,
      business_type: data.businessType,
      store_count: data.storeCount,
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
