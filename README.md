# Tropix Distribution — B2B wholesale survey funnel

Survey-style Meta opt-in for **smokeshop and retail partners**: business qualification → contact capture → thank-you page with Go High Level calendar embed.

## Stack

- **Next.js 15** (App Router) — React survey UI + `/api/leads` for GHL webhook
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
| `/` | One-page wholesale landing (CTA to survey) |
| `/connect` | Partner survey funnel |
| `/connect/thank-you` | Calendar / confirmation after submit |

Without `GHL_INBOUND_WEBHOOK_URL`, the API logs the JSON payload to the server console instead of forwarding.

## Environment (Vercel + `.env.local`)

| Variable | Scope | Purpose |
|----------|--------|---------|
| `GHL_INBOUND_WEBHOOK_URL` | Server | GHL inbound webhook |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Public | Meta Pixel (when ready) |
| `NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL` | Public | Thank-you calendar iframe `src` |

## Webhook payload

See [docs/webhook-payload.md](./docs/webhook-payload.md).

## Brand

Primary colors: `#91E32F` (accent), `#242424` (background). Logo in `public/branding/`.

## Deploy

Push to `main` on GitHub; Vercel runs `next build` automatically.

Set environment variables in the Vercel dashboard for your B2B domain.

## Facebook ad URL (tracking)

```
https://YOUR-B2B-DOMAIN/connect?utm_source=facebook&utm_medium=paid&utm_campaign=YOUR_CAMPAIGN&utm_content=YOUR_AD&fbclid={{fbclid}}
```

UTMs and `fbclid` are stored in session storage on landing and included in every webhook payload.
