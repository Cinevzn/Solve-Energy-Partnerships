const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();

export function getMetaPixelId() {
  return PIXEL_ID ?? "";
}

function canTrack() {
  return Boolean(PIXEL_ID && typeof window !== "undefined" && window.fbq);
}

export function initMetaPixel() {
  if (!PIXEL_ID || typeof window === "undefined") return;

  if (window.fbq) return;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", PIXEL_ID);
}

/** Meta standard event — all routes (including client navigations). */
export function trackPageView() {
  if (!canTrack()) return;
  window.fbq("track", "PageView");
}

/** Meta standard event — funnel step content (optional params for Ads reporting). */
export function trackViewContent(params = {}) {
  if (!canTrack()) return;
  window.fbq("track", "ViewContent", params);
}

const VIEW_CONTENT_BY_PREFIX = [
  { prefix: "/connect/thank-you", content_name: "Booking", content_category: "funnel_step_2" },
  { prefix: "/questionnaire", content_name: "Partner Questionnaire", content_category: "funnel_step_3" },
  { prefix: "/connect", content_name: "Partner Survey", content_category: "funnel_step_1" },
  { prefix: "/", content_name: "Investor Landing", content_category: "funnel" },
];

export function trackViewContentForPath(pathname) {
  if (!pathname) return;

  const match =
    VIEW_CONTENT_BY_PREFIX.find((entry) =>
      entry.prefix === "/" ? pathname === "/" : pathname.startsWith(entry.prefix),
    ) ?? null;

  if (!match) return;

  trackViewContent({
    content_name: match.content_name,
    content_category: match.content_category,
  });
}

/**
 * Meta standard Lead event. Pass the same `event_id` as GHL CAPI for deduplication.
 * @param {string} eventId
 */
export function trackLead(eventId) {
  if (!canTrack() || !eventId) return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}