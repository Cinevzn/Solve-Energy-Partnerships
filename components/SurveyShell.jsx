const LOGO_SRC = "/branding/kt-logo-icon.png";

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
        <a className="brand" href="/">
          <img
            src={LOGO_SRC}
            alt="Tropix Distribution"
            className="brand-logo"
            width={44}
            height={44}
            decoding="async"
          />
          <span className="brand-name">Tropix Distribution</span>
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
          src={LOGO_SRC}
          alt=""
          className="footer-monogram"
          width={72}
          height={36}
          decoding="async"
          aria-hidden="true"
        />
        <a href="https://ktropix.com" target="_blank" rel="noreferrer">
          ktropix.com
        </a>
      </footer>
    </div>
  );
}
