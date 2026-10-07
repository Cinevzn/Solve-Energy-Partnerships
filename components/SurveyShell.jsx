const BADGE_SRC = "/branding/tep-badge-white.png";

export default function SurveyShell({
  children,
  progress,
  stepNumber,
  totalSteps,
  compact = false,
}) {
  return (
    <div className="page">
      <header className="site-header">
        <a
          className="brand"
          href="https://taxequityprofessionals.info"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={BADGE_SRC}
            alt="Tax Equity Professionals"
            className="brand-logo"
            width={44}
            height={44}
            decoding="async"
          />
          <span className="brand-name">Tax Equity Professionals</span>
        </a>
        {!compact && stepNumber != null && (
          <p className="step-label">
            Step {stepNumber} of {totalSteps}
          </p>
        )}
      </header>

      {!compact && (
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <main className="main">{children}</main>

      <footer className="site-footer">
        <img
          src="/branding/tep-monogram-white.png"
          alt=""
          className="footer-monogram"
          width={72}
          height={72}
          decoding="async"
          aria-hidden="true"
        />
        <a href="https://taxequityprofessionals.info" target="_blank" rel="noreferrer">
          taxequityprofessionals.info
        </a>
      </footer>
    </div>
  );
}
