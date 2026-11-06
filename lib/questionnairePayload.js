import { randomUUID } from "crypto";
import { z } from "zod";
import { toE164Us } from "./phone";

const branchEnum = z.enum(["hands_on_run_market", "invest_solve_team", "unsure_both"]);

export const questionnaireSchema = z
  .object({
    leadEventId: z.preprocess(
      (v) => (v === "" || v === undefined || v === null ? undefined : v),
      z.string().uuid().optional(),
    ),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254),
    phoneDigits: z.string().length(10).regex(/^\d+$/),

    q1ThinkingChanged: z.preprocess((v) => (v === "" ? undefined : v), branchEnum),
    q2CurrentRoleShort: z.string().trim().max(5000).optional().default(""),
    q3BusinessHistoryLong: z.string().trim().max(8000).optional().default(""),
    q4HopeLong: z.string().trim().max(8000).optional().default(""),
    q5SayNoLong: z.string().trim().max(8000).optional().default(""),
    q6MoneySitLong: z.string().trim().max(8000).optional().default(""),
    q7PrivateInvestLong: z.string().trim().max(8000).optional().default(""),
    q8DecisionOthersShort: z.string().trim().max(5000).optional().default(""),

    q9PeopleResponsible: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(["none", "1_to_5", "6_to_20", "21_to_50", "50_plus"]).optional(),
    ),
    q10DayToDayOwn: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(["sales", "ops_install", "whole_thing", "not_sure"]).optional(),
    ),
    q11SolveSetsStandardsLong: z.string().trim().max(8000).optional().default(""),
    q12HoursPerWeekShort: z.string().trim().max(5000).optional().default(""),

    q9InvolvementLevel: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(["reporting_only", "regular_call", "big_decisions"]).optional(),
    ),
    q10BeforeCallLong: z.string().trim().max(8000).optional().default(""),

    q13SolarRoofEnergy: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["yes", "no"])),
    q13SolarRoofEnergyDetail: z.string().trim().max(5000).optional().default(""),
    q14NonCompete: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["yes", "no"])),
    q14NonCompeteDetail: z.string().trim().max(5000).optional().default(""),
    q15BankruptcyLitigation: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["yes", "no"])),
    q15BankruptcyLitigationDetail: z.string().trim().max(5000).optional().default(""),
    q16References: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["yes", "no"])),

    q17CallPrepLong: z.string().trim().max(8000).optional().default(""),

    website: z.string().optional(),

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
  })
  .superRefine((data, ctx) => {
    const q1 = data.q1ThinkingChanged;
    const handsBranch =
      q1 === "hands_on_run_market" || q1 === "unsure_both";

    if (handsBranch) {
      if (!data.q9PeopleResponsible) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select an option",
          path: ["q9PeopleResponsible"],
        });
      }
      if (!data.q10DayToDayOwn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select an option",
          path: ["q10DayToDayOwn"],
        });
      }
    }

    if (q1 === "invest_solve_team") {
      if (!data.q9InvolvementLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select an option",
          path: ["q9InvolvementLevel"],
        });
      }
    }

    if (data.q13SolarRoofEnergy === "yes" && !data.q13SolarRoofEnergyDetail?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add details",
        path: ["q13SolarRoofEnergyDetail"],
      });
    }
    if (data.q14NonCompete === "yes" && !data.q14NonCompeteDetail?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add details",
        path: ["q14NonCompeteDetail"],
      });
    }
    if (data.q15BankruptcyLitigation === "yes" && !data.q15BankruptcyLitigationDetail?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add details",
        path: ["q15BankruptcyLitigationDetail"],
      });
    }
  });

/** @param {z.infer<typeof questionnaireSchema>} data */
export function buildQuestionnairePayload(data) {
  const eventId = randomUUID();
  const tracking = data.tracking || {};
  const tags = [
    "facebook-funnel",
    "investor-funnel",
    "solve-energy",
    "market-expansion",
    "partner-questionnaire",
  ];

  const handsBranch =
    data.q1ThinkingChanged === "hands_on_run_market" ||
    data.q1ThinkingChanged === "unsure_both";

  /** @type {Record<string, unknown>} */
  const questionnaire = {
    q1_thinking_changed: data.q1ThinkingChanged,
  };

  Object.assign(questionnaire, {
    q2_current_role: data.q2CurrentRoleShort.trim() || undefined,
    q3_business_history: data.q3BusinessHistoryLong.trim() || undefined,
    q4_hope: data.q4HopeLong.trim() || undefined,
    q5_say_no: data.q5SayNoLong.trim() || undefined,
    q6_money_situation: data.q6MoneySitLong.trim() || undefined,
    q7_private_invest_prior: data.q7PrivateInvestLong.trim() || undefined,
    q8_decision_others: data.q8DecisionOthersShort.trim() || undefined,
  });

  if (handsBranch) {
    questionnaire.q9_people_responsible = data.q9PeopleResponsible;
    questionnaire.q10_day_to_day_own = data.q10DayToDayOwn;
    questionnaire.q11_solve_standards_feeling =
      data.q11SolveSetsStandardsLong.trim() || undefined;
    questionnaire.q12_hours_per_week = data.q12HoursPerWeekShort.trim() || undefined;
  }

  if (data.q1ThinkingChanged === "invest_solve_team") {
    questionnaire.q9_involvement_level = data.q9InvolvementLevel;
    questionnaire.q10_before_call = data.q10BeforeCallLong.trim() || undefined;
  }

  questionnaire.q13_solar_roof_energy = data.q13SolarRoofEnergy;
  if (data.q13SolarRoofEnergy === "yes") {
    questionnaire.q13_solar_roof_energy_detail = data.q13SolarRoofEnergyDetail.trim();
  }
  questionnaire.q14_non_compete = data.q14NonCompete;
  if (data.q14NonCompete === "yes") {
    questionnaire.q14_non_compete_detail = data.q14NonCompeteDetail.trim();
  }
  questionnaire.q15_bankruptcy_litigation = data.q15BankruptcyLitigation;
  if (data.q15BankruptcyLitigation === "yes") {
    questionnaire.q15_bankruptcy_litigation_detail = data.q15BankruptcyLitigationDetail.trim();
  }
  questionnaire.q16_references = data.q16References;
  questionnaire.q17_call_prep = data.q17CallPrepLong.trim() || undefined;

  return {
    source: "Facebook Survey Funnel",
    funnel: "invest.solveenergy.ca",
    stage: "questionnaire",
    event_id: eventId,
    lead_event_id: data.leadEventId ?? "",
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: toE164Us(data.phoneDigits) ?? data.phoneDigits,
    },
    questionnaire,
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
      lead_event_id: data.leadEventId ?? "",
      submitted_at: new Date().toISOString(),
    },
  };
}
