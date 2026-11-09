"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import MarketMapPicker from "@/components/MarketMapPicker";
import { trackLead } from "@/lib/metaPixel";
import { writeLeadSession } from "@/lib/leadSession";
import { formatPhoneDisplay, isCompleteUsPhone, phoneDigitsOnly } from "@/lib/phone";
import { submitLead } from "@/lib/submitLead";
import { getInitialForm } from "@/components/surveySteps";

const AUTO_ADVANCE_MS = 300;

export default function SurveyFlow({ steps, surveyVersion }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(() => ({ ...getInitialForm(), surveyVersion }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [disqualified, setDisqualified] = useState(false);
  const advanceTimerRef = useRef(null);
  const stepIndexRef = useRef(0);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const step = steps[stepIndex];
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex, steps.length],
  );

  function clearAdvanceTimer() {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  useEffect(() => () => clearAdvanceTimer(), []);

  function setField(id, value) {
    setForm((prev) => ({ ...prev, [id]: value }));
    setError("");
  }

  function canContinue() {
    if (step.type === "contact") {
      return (
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        isCompleteUsPhone(form.phone) &&
        form.aboutYou.trim()
      );
    }
    if (step.type === "market_map") {
      return Boolean(form.marketInterest);
    }
    return Boolean(form[step.id]);
  }

  const goToNextStep = useCallback(() => {
    setStepIndex((i) => {
      if (i < steps.length - 1) return i + 1;
      return i;
    });
  }, [steps.length]);

  /** Choice + map steps: set value and auto-advance after short delay */
  function selectAndAdvance(value) {
    clearAdvanceTimer();
    const id = step.id;
    const currentIndex = stepIndexRef.current;

    setForm((prev) => ({ ...prev, [id]: value }));
    setError("");

    if (step.disqualifyOn?.includes(value)) {
      setDisqualified(true);
      return;
    }

    setDisqualified(false);

    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      if (stepIndexRef.current !== currentIndex) return;
      goToNextStep();
    }, AUTO_ADVANCE_MS);
  }

  async function handleNext() {
    if (!canContinue()) {
      setError("Please complete this step to continue.");
      return;
    }

    if (stepIndex < steps.length - 1) {
      clearAdvanceTimer();
      setStepIndex((i) => i + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = await submitLead(form);
      trackLead(result.eventId);
      writeLeadSession({
        eventId: result.eventId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneDigits: phoneDigitsOnly(form.phone),
      });
      router.replace("/connect/thank-you");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (stepIndex === 0) return;
    clearAdvanceTimer();
    setStepIndex((i) => i - 1);
    setError("");
  }

  function handleTryAgain() {
    clearAdvanceTimer();
    setDisqualified(false);
    setForm((prev) => ({ ...prev, accreditedInvestor: "" }));
    setError("");
  }

  function handleClosePage() {
    window.close();
    router.replace("/");
  }

  function handlePhoneChange(raw) {
    setField("phone", formatPhoneDisplay(raw));
  }

  const showManualContinue = step.type === "contact" || step.type === "market_map";

  return (
    <SurveyShell progress={progress} stepNumber={stepIndex + 1} totalSteps={steps.length}>
      <div className="survey-step">
        <p className="eyebrow stage-label">Step 1 of 3</p>
        <h1>{disqualified ? "You\u2019re not eligible to continue" : step.title}</h1>
        {step.subtitle && !disqualified && <p className="lead">{step.subtitle}</p>}

        {disqualified ? (
          <div className="survey-disqualified" role="status">
            <p className="survey-disqualified-lead">
              This program is limited to accredited investors, so we can&apos;t move forward based on your
              answer.
            </p>
            <p className="survey-disqualified-copy">
              If you chose <strong>I am not</strong> by mistake, try again. Otherwise, close this page.
            </p>
          </div>
        ) : (
          <>
        {step.type === "market_map" && (
          <MarketMapPicker
            value={form.marketInterest}
            onChange={(v) => setField("marketInterest", v)}
          />
        )}

        {step.type === "choice" && (
          <ul className="choice-list choice-list-long" role="list">
            {step.options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`choice-btn ${opt.variant === "muted" ? "choice-muted" : ""} ${form[step.id] === opt.value ? "selected" : ""}`}
                  onClick={() => selectAndAdvance(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {step.type === "contact" && (
          <form
            className="contact-form contact-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            <div className="field-row">
              <label>
                First name
                <input
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                />
              </label>
            </div>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                placeholder="(555) 555-5555"
                maxLength={14}
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  handlePhoneChange(e.clipboardData.getData("text"));
                }}
              />
            </label>
            <div className="contact-form-section">
              <h2 className="contact-form-section-title" id="about-you-heading">
                Tell us about you
              </h2>
              <p className="contact-form-section-lead" id="about-you-desc">
                Please share as much detail as you can about your background, your goals, and anything we
                should know before we connect.
              </p>
              <label>
                Your message
                <textarea
                  name="aboutYou"
                  rows={4}
                  maxLength={2000}
                  required
                  autoComplete="off"
                  placeholder="For example: your professional background, why this market interests you, and timing that matters to you"
                  value={form.aboutYou}
                  onChange={(e) => setField("aboutYou", e.target.value)}
                  aria-labelledby="about-you-heading"
                  aria-describedby="about-you-desc"
                />
              </label>
            </div>
            <label className="hp" aria-hidden="true">
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />
            </label>
          </form>
        )}
          </>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {disqualified ? (
          <div className="nav-row survey-disqualified-actions">
            <button type="button" className="btn ghost" onClick={handleClosePage}>
              Close page
            </button>
            <button type="button" className="btn primary" onClick={handleTryAgain}>
              Try again
            </button>
          </div>
        ) : (
          <div className="nav-row">
            {stepIndex > 0 ? (
              <button type="button" className="btn ghost" onClick={handleBack} disabled={submitting}>
                Back
              </button>
            ) : (
              <span />
            )}
            {showManualContinue ? (
              <button
                type="button"
                className="btn primary"
                onClick={handleNext}
                disabled={submitting || !canContinue()}
              >
                {submitting
                  ? "Submitting…"
                  : stepIndex === steps.length - 1
                    ? "Submit and continue"
                    : "Continue"}
              </button>
            ) : (
              <p className="auto-advance-hint">Next step opens when you choose an option</p>
            )}
          </div>
        )}
      </div>
    </SurveyShell>
  );
}
