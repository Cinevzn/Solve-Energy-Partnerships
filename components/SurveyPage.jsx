"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import { trackLead } from "@/lib/metaPixel";
import { formatPhoneDisplay, isCompleteUsPhone } from "@/lib/phone";
import { submitLead } from "@/lib/submitLead";

const INITIAL = {
  taxLiability2026: "",
  paidTaxes2023_2025: "",
  incomeType: "",
  accreditedInvestor: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  website: "",
};

const STEPS = [
  {
    id: "taxLiability2026",
    type: "choice",
    title: "What is your expected tax liability for 2026?",
    options: [
      { value: "20-50k", label: "$20k – $50k" },
      { value: "50-100k", label: "$50k – $100k" },
      { value: "100-200k", label: "$100k – $200k" },
      { value: "200k+", label: "$200k+" },
    ],
  },
  {
    id: "paidTaxes2023_2025",
    type: "choice",
    title: "Did you pay taxes in any of the following tax years (2023–2025)?",
    hint: "Credits can be applied to prior tax years, after the current tax year.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "incomeType",
    type: "choice",
    title: "What is your income type?",
    hint: "All income types are supported.",
    options: [
      { value: "corporate", label: "Corporate" },
      { value: "passive", label: "Passive" },
      { value: "active", label: "Active" },
      { value: "capital_gains", label: "Capital Gains" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "accreditedInvestor",
    type: "choice",
    title: "Are you considered an accredited investor?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "contact",
    type: "contact",
    title: "Where should we send your tax strategies?",
    subtitle: "A strategist will contact you shortly to confirm eligibility.",
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const step = STEPS[stepIndex];
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / STEPS.length) * 100),
    [stepIndex],
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
    return Boolean(form[step.id]);
  }

  async function handleNext() {
    if (!canContinue()) {
      setError("Please complete this step to continue.");
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = await submitLead(form);
      trackLead(result.eventId);
      router.replace("/thank-you");
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

  return (
    <SurveyShell progress={progress} stepNumber={stepIndex + 1} totalSteps={STEPS.length}>
      <div className="survey-step">
        <h1>{step.title}</h1>
        {step.subtitle && <p className="lead">{step.subtitle}</p>}
        {step.hint && <p className="hint">{step.hint}</p>}

        {step.type === "choice" && (
          <ul className="choice-list" role="list">
            {step.options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`choice-btn ${form[step.id] === opt.value ? "selected" : ""}`}
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
            className="contact-form"
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
                  const text = e.clipboardData.getData("text");
                  handlePhoneChange(text);
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
              : stepIndex === STEPS.length - 1
                ? "Schedule Strategy Call"
                : "Continue"}
          </button>
        </div>
      </div>
    </SurveyShell>
  );
}
