const LOGO_SRC = "/branding/solve-logo.svg";

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
            alt="Solve Energy"
            className="brand-logo"
            width={140}
            height={36}
            decoding="async"
          />
        </a>
        {!compact && stepNumber != null && (
          <p className="step-label">
            Step {stepNumber} of {totalSteps}
          </p>
        )}
      </header>

      {!compact && progress != null && (
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <main className="main">{children}</main>

      <footer className="site-footer">
        <a
          className="footer-logo-link"
          href="https://solveenergy.ca"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit solveenergy.ca"
        >
          <img
            src={LOGO_SRC}
            alt=""
            className="footer-monogram"
            width={120}
            height={32}
            decoding="async"
            aria-hidden="true"
          />
        </a>
      </footer>
    </div>
  );
}
