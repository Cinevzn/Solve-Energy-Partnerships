const STORAGE_KEY = "tep_funnel_tracking";

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
];

export function initTrackingFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const incoming = {};
  let hasNew = false;

  for (const key of TRACKING_KEYS) {
    const value = params.get(key);
    if (value) {
      incoming[key] = value;
      hasNew = true;
    }
  }

  if (!hasNew) return;

  const existing = getTracking();
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...existing, ...incoming }),
  );
}

export function getTracking() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
