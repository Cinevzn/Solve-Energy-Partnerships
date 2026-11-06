"use client";

import SurveyShell from "@/components/SurveyShell";

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL?.trim();

export default function ThankYouPage() {
  return (
    <SurveyShell compact progress={100}>
      <div className="thank-you">
        <p className="eyebrow stage-label">Step 3 of 3</p>
        <h1>Schedule a conversation</h1>
        <p className="lead">
          Pick a time below. Our team will review your responses and come prepared to
          discuss Solve Energy&apos;s market expansion with serious partners.
        </p>

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
                Go High Level booking link.
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
