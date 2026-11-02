"use client";

import SurveyShell from "@/components/SurveyShell";

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL?.trim();

export default function ThankYouPage() {
  return (
    <SurveyShell progress={100} stepNumber={null} totalSteps={null} compact>
      <div className="thank-you">
        <p className="eyebrow">You&apos;re all set</p>
        <h1>Book a wholesale call</h1>
        <p className="lead">
          Pick a time below. Our team will review your store profile and come prepared with
          product and ordering details.
        </p>

        <div className="calendar-wrap">
          {CALENDAR_URL ? (
            <iframe
              title="Book a wholesale call"
              src={CALENDAR_URL}
              className="calendar-iframe"
              loading="lazy"
            />
          ) : (
            <div className="calendar-placeholder">
              <p>
                Calendar embed will appear here once{" "}
                <code>NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL</code> is configured with your Go High
                Level booking link.
              </p>
            </div>
          )}
        </div>

        <p className="fine-print">
          Tropix Distribution · GMP certified · Lab tested · Keizer, Oregon
        </p>
      </div>
    </SurveyShell>
  );
}
