import SurveyShell from "../components/SurveyShell.jsx";

const CALENDAR_URL = import.meta.env.VITE_GHL_CALENDAR_EMBED_URL?.trim();

export default function ThankYouPage() {
  return (
    <SurveyShell progress={100} stepNumber={null} totalSteps={null} compact>
      <div className="thank-you">
        <p className="eyebrow">You&apos;re all set</p>
        <h1>Book your strategy call</h1>
        <p className="lead">
          Pick a time below. Our team will review your survey answers before the call.
        </p>

        <div className="calendar-wrap">
          {CALENDAR_URL ? (
            <iframe
              title="Book a call"
              src={CALENDAR_URL}
              className="calendar-iframe"
              loading="lazy"
            />
          ) : (
            <div className="calendar-placeholder">
              <p>
                Calendar embed will appear here once{" "}
                <code>VITE_GHL_CALENDAR_EMBED_URL</code> is configured with your Go High Level
                booking link.
              </p>
            </div>
          )}
        </div>

        <p className="fine-print">
          Tax Equity Professionals · Educational information only · Not tax or investment advice
        </p>
      </div>
    </SurveyShell>
  );
}
