"use client";

import SurveyShell from "@/components/SurveyShell";

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL?.trim();
const VIDEO_URL = process.env.NEXT_PUBLIC_BOOKING_VIDEO_URL?.trim();

export default function ThankYouPage() {
  return (
    <SurveyShell compact progress={100}>
      <div className="thank-you">
        <p className="eyebrow stage-label">Step 2 of 2</p>
        <h1>Watch and book a call</h1>
        <p className="lead">
          Thanks for your answers. Review the overview below, then choose a time to speak
          with our team about your market of interest.
        </p>

        <div className="video-wrap">
          {VIDEO_URL ? (
            <iframe
              title="Solve Energy partner overview"
              src={VIDEO_URL}
              className="video-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="video-placeholder" aria-label="Video placeholder">
              <span className="video-placeholder-icon" aria-hidden="true">
                ▶
              </span>
              <p className="video-placeholder-title">Partner overview video</p>
              <p className="video-placeholder-copy">
                Add your video URL in{" "}
                <code>NEXT_PUBLIC_BOOKING_VIDEO_URL</code> (YouTube embed, Vimeo, etc.).
              </p>
            </div>
          )}
        </div>

        <h2 className="thank-you-subhead">Book your call</h2>

        <div className="calendar-wrap">
          {CALENDAR_URL ? (
            <iframe
              title="Book a call with Solve Energy"
              src={CALENDAR_URL}
              className="calendar-iframe"
              loading="lazy"
            />
          ) : (
            <div className="calendar-placeholder">
              <p>
                Calendar embed will appear here once{" "}
                <code>NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL</code> is configured with your
                booking link.
              </p>
            </div>
          )}
        </div>

        <p className="fine-print">
          Solve Energy · Victoria · Langley · Kelowna ·{" "}
          <a href="tel:+18886676583">1-888-667-6583</a>
        </p>
      </div>
    </SurveyShell>
  );
}
