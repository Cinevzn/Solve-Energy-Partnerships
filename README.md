# Tax Equity Pros — Facebook survey funnel

Survey-style Meta opt-in for **partners.taxequityprofessionals.info**: qualification questions → contact capture → thank-you page with Go High Level calendar embed.

## Stack

- **Client:** React (Vite), mobile-first one-question-per-step survey
- **Server:** Node (Express) — validates submissions, POSTs standard JSON to GHL inbound webhook

## Quick start

```bash
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

- Survey: http://localhost:5173  
- API (proxied): http://localhost:5173/api/leads  

Without `GHL_INBOUND_WEBHOOK_URL`, the server logs the JSON payload to the console instead of forwarding.

## Environment

| Variable | Where | Purpose |
|----------|--------|---------|
| `GHL_INBOUND_WEBHOOK_URL` | `server/.env` | GHL inbound webhook (when ready) |
| `CLIENT_ORIGIN` | `server/.env` | Production origin (`https://partners.taxequityprofessionals.info`) |
| `VITE_FB_PIXEL_ID` | `client/.env` | Meta Pixel (when ready) |
| `VITE_GHL_CALENDAR_EMBED_URL` | `client/.env` | iframe `src` for embedded calendar |

## Webhook payload

See [docs/webhook-payload.md](./docs/webhook-payload.md).

Sub-$100k expected liability (`20-50k`, `50-100k`) adds tag **`sub-100k-liability`**.

## Production build

```bash
npm run build
npm start
```

Serves the built React app from the Express server (single deploy target).

## Facebook ad URL (tracking)

```
https://partners.taxequityprofessionals.info/?utm_source=facebook&utm_medium=paid&utm_campaign=YOUR_CAMPAIGN&utm_content=YOUR_AD&fbclid={{fbclid}}
```

UTMs and `fbclid` are stored in session storage on landing and included in every webhook payload.
