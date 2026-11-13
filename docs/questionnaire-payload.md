# Partner questionnaire webhook (step 3)

`POST /api/questionnaire` with `Content-Type: application/json`.

The public page is **`/questionnaire`**. Anyone can complete it (e.g. after booking or from a **CRM email link**). Legacy **`/questionare`** URLs redirect here.

**Funnel:** After step 1 submits, the same browser **session** stores name, email, phone, and lead `eventId`. On `/questionnaire`, contact fields are **not shown** when that session is present (or when **complete** contact info is in the URL). Otherwise the form asks for contact details.

**Optional query prefill (CRM / automation):**  
`/questionnaire?firstName=Jane&lastName=Doe&email=jane%40example.com&phone=6045551234`  
Optional: `leadEventId=<uuid>` (or `event_id`) to tie back to step 1’s `meta.event_id`; omit if unknown.

## Environment

| Variable | Purpose |
|----------|---------|
| `GHL_QUESTIONNAIRE_WEBHOOK_URL` | Dedicated GHL inbound URL for this form (optional) |
| `GHL_INBOUND_WEBHOOK_URL` | Used if `GHL_QUESTIONNAIRE_WEBHOOK_URL` is unset |

## Top-level payload

| Field | Notes |
|-------|--------|
| `source` | `"Facebook Survey Funnel"` |
| `funnel` | `"invest.solveenergy.ca"` |
| `stage` | `"questionnaire"` |
| `event_id` | UUID for this submission |
| `lead_event_id` | UUID from step 1 when known; otherwise empty string |
| `contact` | `firstName`, `lastName`, `email`, `phone` (E.164) |
| `questionnaire` | Answers (see below); optional fields omitted when empty |
| `tracking` | Same UTMs / `fbclid` as step 1 |
| `tags` | Includes `partner-questionnaire` plus shared funnel tags |
| `meta` | `event_id`, `lead_event_id`, `submitted_at` |

## `questionnaire` object

Branching is by **`q1_thinking_changed`** (required; same enum as step 1 `participation_model`):

- **`hands_on_run_market`** or **`unsure_both`**: required `q9_people_responsible`, `q10_day_to_day_own`; optional `q11` through `q12` keys.
- **`invest_solve_team`**: required `q9_involvement_level`; optional `q10_before_call`.

**Required (always):** `q1_thinking_changed`, `q13_*`, `q14_*`, `q15_*`, `q16_references`.

| Key | Question | Type |
|-----|-----------|------|
| `q1_thinking_changed` | Q1 branch (required) | enum |
| `q2_current_role` | Q2 | string or omitted |
| `q3_business_history` | Q3 | string or omitted |
| `q4_hope` | Q4 | string or omitted |
| `q5_say_no` | Q5 | string or omitted |
| `q6_money_situation` | Q6 | string or omitted |
| `q7_private_invest_prior` | Q7 | string or omitted |
| `q8_decision_others` | Q8 | string or omitted |
| `q9_people_responsible` | Q9 (hands) | `none` \| `1_to_5` \| `6_to_20` \| `21_to_50` \| `50_plus` |
| `q10_day_to_day_own` | Q10 (hands) | `sales` \| `ops_install` \| `whole_thing` \| `not_sure` |
| `q11_solve_standards_feeling` | Q11 | string or omitted |
| `q12_hours_per_week` | Q12 | string or omitted |
| `q9_involvement_level` | Q9 (invest) | `reporting_only` \| `regular_call` \| `big_decisions` |
| `q10_before_call` | Q10 (invest) | string or omitted |
| `q13_solar_roof_energy` | Q13 | `yes` \| `no` |
| `q13_solar_roof_energy_detail` | Q13 detail | required if yes |
| `q14_non_compete` | Q14 | `yes` \| `no` |
| `q14_non_compete_detail` | Q14 detail | required if yes |
| `q15_bankruptcy_litigation` | Q15 | `yes` \| `no` |
| `q15_bankruptcy_litigation_detail` | Q15 detail | required if yes |
| `q16_references` | Q16 | `yes` \| `no` |
| `q17_call_prep` | Q17 | string or omitted |

## Honeypot

If `website` is non-empty, the API returns `400` (same pattern as `/api/leads`).
