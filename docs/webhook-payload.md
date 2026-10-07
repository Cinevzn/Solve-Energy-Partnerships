# GHL inbound webhook — standard JSON payload

`POST` your inbound webhook URL with `Content-Type: application/json`.

The funnel API (`POST /api/leads`) builds and forwards this body automatically.

## Example

```json
{
  "source": "Facebook Survey Funnel",
  "funnel": "partners.taxequityprofessionals.info",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "contact": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+15551234567"
  },
  "survey": {
    "tax_liability_2026": "50-100k",
    "paid_taxes_2023_2025": "yes",
    "income_type": "active",
    "accredited_investor": "not_sure"
  },
  "tracking": {
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "tax_equity_2026_q1",
    "utm_content": "carousel_v1",
    "utm_term": "",
    "fbclid": ""
  },
  "tags": [
    "facebook-funnel",
    "partners-survey",
    "sub-100k-liability"
  ],
  "meta": {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "submitted_at": "2026-10-07T12:00:00.000Z"
  }
}
```

## Tags

| Tag | When applied |
|-----|----------------|
| `facebook-funnel` | Every submission |
| `partners-survey` | Every submission |
| `sub-100k-liability` | `tax_liability_2026` is `20-50k` or `50-100k` |

## Survey field values

- **tax_liability_2026:** `20-50k` \| `50-100k` \| `100-200k` \| `200k+`
- **paid_taxes_2023_2025:** `yes` \| `no`
- **income_type:** `corporate` \| `passive` \| `active` \| `capital_gains` \| `other`
- **accredited_investor:** `yes` \| `no` \| `not_sure`

## Meta Pixel deduplication

Use the same `event_id` / `meta.event_id` in Go High Level CAPI (Lead event) as the browser Pixel `Lead` event (`eventID` option).

## Configuration

Set `GHL_INBOUND_WEBHOOK_URL` in `server/.env`. Map JSON paths in your GHL inbound webhook workflow to contact fields and tags.
