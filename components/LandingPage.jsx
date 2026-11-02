import Link from "next/link";
import SurveyShell from "@/components/SurveyShell";

const VALUE_POINTS = [
  {
    title: "Lab-tested every batch",
    body: "Certificate of Analysis on every product—easy for you and your customers to trust.",
  },
  {
    title: "GMP certified",
    body: "Manufactured to strict quality standards, formulated and packed in Keizer, Oregon.",
  },
  {
    title: "Built for retail",
    body: "Liquid shots, capsules, gummies, and powders your smokeshop customers already ask for.",
  },
];

export default function LandingPage() {
  return (
    <SurveyShell compact>
      <div className="landing">
        <p className="eyebrow">Wholesale partners</p>
        <h1>Bring lab-tested K Tropix to your stores</h1>
        <p className="lead">
          Tropix Distribution works with smokeshops, convenience stores, and distributors
          nationwide. Tell us about your business—we&apos;ll follow up with wholesale pricing
          and ordering details.
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
            Start partner application
          </Link>
          <p className="landing-note">Takes about 2 minutes · No obligation</p>
        </div>

        <p className="fine-print landing-trust">
          Tropix Distribution · GMP certified · Lab tested ·{" "}
          <a href="https://ktropix.com" target="_blank" rel="noreferrer">
            ktropix.com
          </a>
        </p>
      </div>
    </SurveyShell>
  );
}
