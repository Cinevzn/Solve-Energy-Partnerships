# Solve Energy investor survey funnel

Survey-style Meta opt-in for **market expansion partners**: one qualification survey (step 1), then a **VSL + booking** page (step 2).

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
| `/connect/thank-you` | Step 2: video embed + calendar booking |

Without `GHL_INBOUND_WEBHOOK_URL`, the API logs the JSON payload to the server console instead of forwarding.

## Environment (Vercel + `.env.local`)

| Variable | Scope | Purpose |
|----------|--------|---------|
| `GHL_INBOUND_WEBHOOK_URL` | Server | GHL inbound webhook |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Public | Meta Pixel (when ready) |
| `NEXT_PUBLIC_BOOKING_VIDEO_URL` | Public | Step 2 video iframe `src` (YouTube/Vimeo embed) |
| `NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL` | Public | Step 2 calendar iframe `src` |

## Webhook payload

See [docs/webhook-payload.md](./docs/webhook-payload.md).

## Brand

Solve Energy palette and logo: `public/branding/`.

## Deploy

Push to `main` on GitHub; Vercel runs `next build` automatically.

## Facebook ad URL (tracking)

```
https://YOUR-DOMAIN/connect?utm_source=facebook&utm_medium=paid&utm_campaign=YOUR_CAMPAIGN&utm_content=YOUR_AD&fbclid={{fbclid}}
```

UTMs and `fbclid` are stored in session storage on landing and included in every webhook payload.
