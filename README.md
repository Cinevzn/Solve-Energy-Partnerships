# Tax Equity Pros — Facebook survey funnel

Survey-style Meta opt-in for **partners.taxequityprofessionals.info**: qualification questions → contact capture → thank-you page with Go High Level calendar embed.

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

Without `GHL_INBOUND_WEBHOOK_URL`, the API logs the JSON payload to the server console instead of forwarding.

## Environment (Vercel + `.env.local`)

| Variable | Scope | Purpose |
|----------|--------|---------|
| `GHL_INBOUND_WEBHOOK_URL` | Server | GHL inbound webhook |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Public | Meta Pixel (when ready) |
| `NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL` | Public | Thank-you calendar iframe `src` |

## Webhook payload

See [docs/webhook-payload.md](./docs/webhook-payload.md).

Sub-$100k expected liability (`20-50k`, `50-100k`) adds tag **`sub-100k-liability`**.

## Deploy

Push to `main` on GitHub; Vercel runs `next build` automatically.

Point **partners.taxequityprofessionals.info** at the Vercel project and set environment variables in the Vercel dashboard.

## Facebook ad URL (tracking)

```
https://partners.taxequityprofessionals.info/?utm_source=facebook&utm_medium=paid&utm_campaign=YOUR_CAMPAIGN&utm_content=YOUR_AD&fbclid={{fbclid}}
```

UTMs and `fbclid` are stored in session storage on landing and included in every webhook payload.
