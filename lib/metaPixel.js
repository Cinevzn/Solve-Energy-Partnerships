const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();

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
  window.fbq("track", "PageView");
}

export function trackLead(eventId) {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}
