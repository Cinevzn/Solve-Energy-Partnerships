/**
 * Step 2 thank-you page: VSL + booking vs booking-only.
 * Set `NEXT_PUBLIC_THANK_YOU_SHOW_VIDEO=true` and `NEXT_PUBLIC_BOOKING_VIDEO_URL` when the overview video is ready.
 */
export function thankYouShowVideo() {
  return process.env.NEXT_PUBLIC_THANK_YOU_SHOW_VIDEO === "true";
}
