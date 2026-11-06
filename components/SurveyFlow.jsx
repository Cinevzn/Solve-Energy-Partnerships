"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import MarketMapPicker from "@/components/MarketMapPicker";
import { trackLead } from "@/lib/metaPixel";
import { formatPhoneDisplay, isCompleteUsPhone } from "@/lib/phone";
import { submitLead } from "@/lib/submitLead";
import { getInitialForm } from "@/components/surveySteps";

const AUTO_ADVANCE_MS = 300;

export default function SurveyFlow({ steps, surveyVersion }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(() => ({ ...getInitialForm(), surveyVersion }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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
        isCompleteUsPhone(form.phone)
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

  function handlePhoneChange(raw) {
    setField("phone", formatPhoneDisplay(raw));
  }

  const versionLabel = surveyVersion === "v2" ? " (map)" : "";

  const showManualContinue = step.type === "contact" || step.type === "market_map";

  return (
    <SurveyShell progress={progress} stepNumber={stepIndex + 1} totalSteps={steps.length}>
      <div className="survey-step">
        <p className="eyebrow stage-label">
          Step 1 of 2{versionLabel} · Question {stepIndex + 1} of {steps.length}
        </p>
        <h1>{step.title}</h1>
        {step.subtitle && <p className="lead">{step.subtitle}</p>}

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

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

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
      </div>
    </SurveyShell>
  );
}
