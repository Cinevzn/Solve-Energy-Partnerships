"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import MarketMapPicker from "@/components/MarketMapPicker";
import { trackLead } from "@/lib/metaPixel";
import { formatPhoneDisplay, isCompleteUsPhone } from "@/lib/phone";
import { submitLead } from "@/lib/submitLead";
import { getInitialForm } from "@/components/surveySteps";

export default function SurveyFlow({ steps, surveyVersion }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(() => ({ ...getInitialForm(), surveyVersion }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const step = steps[stepIndex];
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex, steps.length],
  );

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

  async function handleNext() {
    if (!canContinue()) {
      setError("Please complete this step to continue.");
      return;
    }

    if (stepIndex < steps.length - 1) {
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
    setStepIndex((i) => i - 1);
    setError("");
  }

  function handleChoice(value) {
    setField(step.id, value);
  }

  function handlePhoneChange(raw) {
    setField("phone", formatPhoneDisplay(raw));
  }

  const versionLabel = surveyVersion === "v2" ? " (map)" : "";

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
                  onClick={() => handleChoice(opt.value)}
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
        </div>
      </div>
    </SurveyShell>
  );
}
