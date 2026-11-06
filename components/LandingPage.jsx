import Link from "next/link";
import SurveyShell from "@/components/SurveyShell";

const VALUE_POINTS = [
  {
    title: "Renewable energy made simple",
    body: "Personalized solar solutions across Western Canada, helping homeowners and businesses lower bills and carbon footprint.",
  },
  {
    title: "Proven team & installs",
    body: "Experienced crews, clear communication, and installs from Victoria to Kelowna and Langley.",
  },
  {
    title: "Expanding into new markets",
    body: "We’re raising partnership and investment interest to grow clean energy access in additional communities.",
  },
];

export default function LandingPage() {
  return (
    <SurveyShell compact>
      <div className="landing">
        <p className="eyebrow">Investment opportunity</p>
        <h1>Partner with Solve Energy as we launch new markets</h1>
        <p className="lead">
          Solve Energy is building a sustainable future with affordable clean power.
          Share a few details about your background and timeline. We&apos;ll follow up with
          information about our expansion plans.
        </p>

        <ul className="value-list">
          {VALUE_POINTS.map((item) => (
            <li key={item.title} className="value-item">
              <span className="value-check" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="landing-actions">
          <Link href="/connect" className="btn primary landing-cta">
            Start investor inquiry
          </Link>
          <p className="landing-note">Takes about 3 minutes</p>
        </div>

        <p className="fine-print landing-trust">
          Solve Energy · British Columbia ·{" "}
          <a href="https://solveenergy.ca" target="_blank" rel="noreferrer">
            solveenergy.ca
          </a>
        </p>
        <p className="disclaimer">
          This page is for informational interest only and does not constitute an offer
          to sell securities. Opportunities may be available only to eligible investors
          under applicable laws.
        </p>
      </div>
    </SurveyShell>
  );
}
