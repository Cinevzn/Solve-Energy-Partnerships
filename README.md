# Solve Energy investor survey funnel

Survey-style Meta opt-in for **market expansion partners**: qualification survey (step 1), **VSL + booking** (step 2), then the **partner questionnaire** (step 3).

## Stack

- **Next.js 15** (App Router): React survey UI + `POST /api/leads` for GHL webhook
- Deploy on **Vercel** (connected to GitHub)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

| Route | Purpose |
|-------|---------|
| `/` | Investor landing (CTA to survey) |
| `/connect` | Step 1 (default, v2): **map** market picker + survey + webhook (tag `survey-v2-map`) |
| `/connect/v1` | Step 1 (v1): market list + same survey + webhook |
| `/connect/v2` | Redirects to `/connect` (legacy URL) |
| `/connect/thank-you` | Step 2: calendar booking (+ optional VSL when `NEXT_PUBLIC_THANK_YOU_SHOW_VIDEO=true`) |
| `/questionare` | Step 3: partner questionnaire → `POST /api/questionnaire`. Contact fields show only if not already known (funnel session after step 1, or full query prefill for CRM) |

Without `GHL_INBOUND_WEBHOOK_URL`, the leads API logs the JSON payload to the server console instead of forwarding. The questionnaire API uses `GHL_QUESTIONNAIRE_WEBHOOK_URL` when set, otherwise falls back to the same URL.

## Environment (Vercel + `.env.local`)

| Variable | Scope | Purpose |
|----------|--------|---------|
| `GHL_INBOUND_WEBHOOK_URL` | Server | GHL inbound webhook (step 1 lead) |
| `GHL_QUESTIONNAIRE_WEBHOOK_URL` | Server | Optional separate GHL URL for step 3 |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Public | Meta Pixel (when ready) |
| `NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL` | Public | Step 2 calendar iframe `src` |
| `NEXT_PUBLIC_THANK_YOU_SHOW_VIDEO` | Public | `true` = step 2 shows VSL copy + embed (requires video URL). Default off = book-only |
| `NEXT_PUBLIC_BOOKING_VIDEO_URL` | Public | Step 2 video iframe `src` when show-video flag is on |

## Webhook payload

See [docs/webhook-payload.md](./docs/webhook-payload.md) (step 1) and [docs/questionnaire-payload.md](./docs/questionnaire-payload.md) (step 3).

## Brand

Solve Energy palette and logo: `public/branding/`.

## Deploy

Push to `main` on GitHub; Vercel runs `next build` automatically.

## Facebook ad URL (tracking)

```
https://YOUR-DOMAIN/connect?utm_source=facebook&utm_medium=paid&utm_campaign=YOUR_CAMPAIGN&utm_content=YOUR_AD&fbclid={{fbclid}}
```

UTMs and `fbclid` are stored in session storage on landing and included in every webhook payload.
