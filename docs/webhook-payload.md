# GHL inbound webhook — standard JSON payload

`POST` your inbound webhook URL with `Content-Type: application/json`.

The funnel API (`POST /api/leads`) builds and forwards this body automatically.

## Example

```json
{
  "source": "Facebook Survey Funnel",
  "funnel": "b2b.ktropix.com",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "contact": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@smokeshop.example.com",
    "phone": "+15551234567",
    "companyName": "Jane's Smoke & Vape"
  },
  "survey": {
    "business_name": "Jane's Smoke & Vape",
    "business_type": "convenience_store",
    "store_count": "2-5"
  },
  "tracking": {
    "utm_source": "facebook",
    "utm_medium": "paid",
    "utm_campaign": "ktropix_b2b_q1",
    "utm_content": "carousel_v1",
    "utm_term": "",
    "fbclid": ""
  },
  "tags": [
    "facebook-funnel",
    "b2b-wholesale",
    "smokeshop-survey"
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
| `b2b-wholesale` | Every submission |
| `smokeshop-survey` | Every submission |
| `multi-store-10-plus` | `store_count` is `10+` |

## Survey field values

- **business_name:** free text (also on `contact.companyName`)
- **business_type:** `convenience_store` \| `online_store` \| `distributor` \| `other`
- **store_count:** `1` \| `2-5` \| `5-10` \| `10+`

## Meta Pixel deduplication

Use the same `event_id` / `meta.event_id` in Go High Level CAPI (Lead event) as the browser Pixel `Lead` event (`eventID` option).

## Configuration

Set `GHL_INBOUND_WEBHOOK_URL` in `.env.local`. Map JSON paths in your GHL inbound webhook workflow to contact fields and tags.
