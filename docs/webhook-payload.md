# GHL inbound webhook JSON payload

`POST` your inbound webhook URL with `Content-Type: application/json`.

The funnel API (`POST /api/leads`) builds and forwards this body after the survey (step 1) completes.

## Example

```json
{
  "source": "Facebook Survey Funnel",
  "funnel": "invest.solveenergy.ca",
  "stage": "survey",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "contact": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+16045551234"
  },
  "survey": {
    "survey_version": "v1",
    "accredited_investor": "income_over_250k",
    "market_interest": "calgary_ab",
    "participation_model": "hands_on_run_market",
    "based_near": "live_in_market",
    "capital_available": "250k_500k",
    "own_capital": "mine_liquid_now",
    "invest_timeline": "ready_now",
    "about_you": "Former operator in HVAC; interested in Calgary and ready to move within 90 days."
  },
  "tracking": {
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "solve_expansion_q1",
    "utm_content": "carousel_v1",
    "utm_term": "",
    "fbclid": ""
  },
  "tags": [
    "facebook-funnel",
    "investor-funnel",
    "solve-energy",
    "market-expansion",
    "timeline-ready-now",
    "hands-on-market"
  ],
  "meta": {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "submitted_at": "2026-11-06T12:00:00.000Z"
  }
}
```

## Survey field values

- **survey_version:** `v1` (market list at `/connect/v1`) | `v2` (map picker at `/connect`, default)
- **accredited_investor:** `income_over_250k` | `income_over_300k_household` | `assets_over_1m` | `not_sure` | `not_accredited` (disqualified in UI before submit — should not appear on completed leads)
- **market_interest:** `calgary_ab` | `edmonton_ab` | `red_deer_ab` | `lethbridge_ab` | `grande_prairie_ab` | `saskatoon_sk` | `regina_sk` | `winnipeg_mb` | `toronto_on` | `ottawa_on` | `kingston_on` | `windsor_on` | `sudbury_on` | `montreal_qc` | `quebec_city_qc` | `new_brunswick` | `halifax_ns` | `st_johns_nl` | `other_city`
- **participation_model:** `hands_on_run_market` | `invest_solve_team` | `unsure_both`
- **based_near:** `live_in_market` | `within_hour` | `would_relocate` | `remote`
- **capital_available:** `under_250k` | `250k_500k` | `500k_750k` | `750k_1m` | `1m_plus`
- **own_capital:** `mine_liquid_now` | `mine_sell_or_borrow` | `raise_from_others` | `not_sure_yet`
- **invest_timeline:** `ready_now` | `within_three_months` | `three_to_six_months` | `still_exploring`
- **about_you:** Free-text string from the contact step (required). Max 2000 characters.

## Tags

| Tag | When applied |
|-----|----------------|
| `facebook-funnel` | Every submission |
| `investor-funnel` | Every submission |
| `solve-energy` | Every submission |
| `market-expansion` | Every submission |
| `timeline-ready-now` | `invest_timeline` is `ready_now` |
| `hands-on-market` | `participation_model` is `hands_on_run_market` |
| `capital-750k-plus` | `capital_available` is `750k_1m` or `1m_plus` |
| `survey-v2-map` | `survey_version` is `v2` (submitted from `/connect` or legacy `/connect/v2`) |
| `accredited-not-sure` | `accredited_investor` is `not_sure` |

## Meta Pixel deduplication

Use the same `event_id` / `meta.event_id` in Go High Level CAPI (Lead event) as the browser Pixel `Lead` event (`eventID` option).

## Configuration

Set `GHL_INBOUND_WEBHOOK_URL` in `.env.local`. Map JSON paths in your GHL inbound webhook workflow to contact fields and tags.
