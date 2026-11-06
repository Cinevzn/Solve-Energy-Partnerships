import Link from "next/link";
import SurveyShell from "@/components/SurveyShell";

export default function NotAFitPage() {
  return (
    <SurveyShell compact>
      <div className="thank-you">
        <p className="eyebrow">Thank you for your interest</p>
        <h1>We appreciate you reaching out</h1>
        <p className="lead">
          This opportunity is focused on partners prepared to invest $100K or more. If
          your plans change, you are welcome to return and complete the inquiry anytime.
        </p>
        <div className="landing-actions">
          <Link href="/" className="btn primary landing-cta">
            Back to home
          </Link>
          <a
            href="https://solveenergy.ca"
            className="btn ghost landing-cta"
            target="_blank"
            rel="noreferrer"
          >
            Visit solveenergy.ca
          </a>
        </div>
      </div>
    </SurveyShell>
  );
}
