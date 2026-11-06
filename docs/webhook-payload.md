# GHL inbound webhook JSON payloads

`POST` your inbound webhook URL with `Content-Type: application/json`.

| Stage | API route | Env variable |
|-------|-----------|--------------|
| 1: Qualification + contact | `POST /api/leads` | `GHL_INBOUND_WEBHOOK_URL` |
| 2: Investor profile | `POST /api/leads/profile` | `GHL_INBOUND_WEBHOOK_URL_STEP2` |

Use **email + phone** (or `parent_event_id` on stage 2) in GHL to update the same contact.

## Stage 1 example

```json
{
  "source": "Facebook Survey Funnel",
  "funnel": "invest.solveenergy.ca",
  "stage": "qualification",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "contact": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+16045551234"
  },
  "survey": {
    "sales_background": "yes_professional",
    "investment_participation": "active",
    "investment_timeline": "0_3_months",
    "investment_budget": "250k_500k"
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
    "stage-qualification",
    "timeline-hot-0-3mo",
    "investor-active-participant"
  ],
  "meta": {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "submitted_at": "2026-11-05T12:00:00.000Z"
  }
}
```

### Stage 1 survey field values

- **sales_background:** `yes_professional` | `yes_some` | `no`
- **investment_participation:** `active` | `passive` | `either`
- **investment_timeline:** `0_3_months` | `3_6_months` | `6_12_months` | `12_plus`
- **investment_budget:** `100k_200k` | `250k_500k` | `500k_1m` | `1m_plus`

### Stage 1 tags

| Tag | When applied |
|-----|----------------|
| `facebook-funnel` | Every submission |
| `investor-funnel` | Every submission |
| `solve-energy` | Every submission |
| `stage-qualification` | Every submission |
| `timeline-hot-0-3mo` | Timeline is `0_3_months` |
| `investor-active-participant` | Participation is `active` |
| `budget-500k-plus` | Budget is `500k_1m` or `1m_plus` |

## Stage 2 example

```json
{
  "source": "Facebook Survey Funnel",
  "funnel": "invest.solveenergy.ca",
  "stage": "investor_profile",
  "event_id": "660e8400-e29b-41d4-a716-446655440001",
  "parent_event_id": "550e8400-e29b-41d4-a716-446655440000",
  "contact": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+16045551234"
  },
  "survey": {
    "location": "Calgary, AB",
    "willing_to_relocate": "open_to_discuss",
    "investor_background": "Former regional sales director with experience in home services…"
  },
  "tracking": { "utm_source": "facebook", "utm_medium": "paid", "utm_campaign": "", "utm_content": "", "utm_term": "", "fbclid": "" },
  "tags": [
    "facebook-funnel",
    "investor-funnel",
    "solve-energy",
    "stage-investor-profile",
    "profile-complete"
  ],
  "meta": {
    "event_id": "660e8400-e29b-41d4-a716-446655440001",
    "parent_event_id": "550e8400-e29b-41d4-a716-446655440000",
    "submitted_at": "2026-11-05T12:05:00.000Z"
  }
}
```

### Stage 2 survey field values

- **location:** free text
- **willing_to_relocate:** `yes` | `no` | `open_to_discuss` | `remote_only`
- **investor_background:** free text (min 150 characters)

| Tag | When applied |
|-----|----------------|
| `profile-complete` | Every stage 2 submission |
| `willing-relocate-yes` | Relocation is `yes` |

## Meta Pixel deduplication

Use the stage 1 `event_id` / `meta.event_id` in Go High Level CAPI (Lead event) as the browser Pixel `Lead` event (`eventID` option). Stage 2 does not fire Lead by default.

## Configuration

Set webhook URLs in `.env.local`. Map JSON paths in your GHL inbound webhook workflows to contact fields and tags.
