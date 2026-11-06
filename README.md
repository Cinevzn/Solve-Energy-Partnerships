# Solve Energy — investor survey funnel

Survey-style Meta opt-in for **investors and expansion partners**: qualification → contact → **stage 2 profile** → thank-you with Go High Level calendar embed.

## Stack

- **Next.js 15** (App Router) — React survey UI + `/api/leads` and `/api/leads/profile` for GHL webhooks
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
| `/connect` | Stage 1 — sales background, participation, timeline, contact |
| `/connect/profile` | Stage 2 — location, relocation, investor background |
| `/connect/thank-you` | Calendar / confirmation |

Without webhook env vars, each API logs its JSON payload to the server console instead of forwarding.

## Environment (Vercel + `.env.local`)

| Variable | Scope | Purpose |
|----------|--------|---------|
| `GHL_INBOUND_WEBHOOK_URL` | Server | Stage 1 GHL inbound webhook |
| `GHL_INBOUND_WEBHOOK_URL_STEP2` | Server | Stage 2 GHL inbound webhook |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Public | Meta Pixel (when ready) |
| `NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL` | Public | Thank-you calendar iframe `src` |

## Webhook payloads

See [docs/webhook-payload.md](./docs/webhook-payload.md).

## Brand

Solve Energy palette: `#1E2418`, `#E8EBE0`, `#00B934`, `#BADBE6`. Logo: `public/branding/solve-logo.svg`.

## Deploy

Push to `main` on GitHub; Vercel runs `next build` automatically.

Set environment variables in the Vercel dashboard for your campaign domain.

## Facebook ad URL (tracking)

```
https://YOUR-DOMAIN/connect?utm_source=facebook&utm_medium=paid&utm_campaign=YOUR_CAMPAIGN&utm_content=YOUR_AD&fbclid={{fbclid}}
```

UTMs and `fbclid` are stored in session storage on landing and included in every webhook payload.
