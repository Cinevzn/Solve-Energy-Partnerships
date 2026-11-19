# Meta Pixel (browser) + GHL Conversions API

## Environment

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_FB_PIXEL_ID` | `2199077957352715` |

Set in Vercel **and** `.env.local` for local testing. Redeploy after changing.

## Standard events (browser)

| Event | When |
|-------|------|
| **PageView** | Every route load and client navigation |
| **ViewContent** | Funnel pages: landing, survey (`/connect*`), thank-you booking, questionnaire |
| **Lead** | Step 1 survey saved successfully (`SurveyFlow` → `trackLead(eventId)`) |

`Lead` is sent with `{ eventID: <uuid> }` — the same UUID as webhook `event_id` and `meta.event_id`.

## GHL CAPI deduplication

On the step 1 inbound webhook workflow, fire **Lead** via Conversions API with:

- **event_name:** `Lead`
- **event_id:** `{{event_id}}` or `{{meta.event_id}}` from the webhook body
- **Customer information:** email, phone, first name, last name from `contact`
- **action_source:** `website`

If `event_id` does not match the browser `Lead` `eventID`, Meta may double-count.

## QA

1. Meta Events Manager → **Test events** (or Pixel Helper).
2. Load site → **PageView** + **ViewContent** on home.
3. Complete step 1 → **Lead** with an event ID.
4. Confirm GHL CAPI **Lead** uses the same `event_id`.