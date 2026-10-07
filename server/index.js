import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { buildLeadPayload, leadSchema } from "./leadPayload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  ...(process.env.CLIENT_ORIGIN_DEV?.split(",").map((o) => o.trim()) || [
    "http://localhost:5173",
  ]),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "32kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/leads", limiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  if (parsed.data.website?.trim()) {
    res.status(400).json({ error: "Invalid submission" });
    return;
  }

  const webhookUrl = process.env.GHL_INBOUND_WEBHOOK_URL;
  const payload = buildLeadPayload(parsed.data);

  if (!webhookUrl) {
    console.warn("[leads] GHL_INBOUND_WEBHOOK_URL not set — logging payload only");
    console.info(JSON.stringify(payload, null, 2));
    res.json({ ok: true, forwarded: false, eventId: payload.meta.event_id });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[leads] GHL webhook failed", response.status, text);
      res.status(502).json({ error: "Unable to save your response. Please try again." });
      return;
    }

    res.json({ ok: true, forwarded: true, eventId: payload.meta.event_id });
  } catch (err) {
    console.error("[leads] GHL webhook error", err);
    res.status(502).json({ error: "Unable to save your response. Please try again." });
  }
});

const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`TEP funnel API listening on http://localhost:${PORT}`);
});
