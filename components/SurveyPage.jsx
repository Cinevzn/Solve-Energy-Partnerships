"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import { setStoredLead } from "@/lib/leadSession";
import { trackLead } from "@/lib/metaPixel";
import { formatPhoneDisplay, isCompleteUsPhone } from "@/lib/phone";
import { submitLead } from "@/lib/submitLead";

const INITIAL = {
  salesBackground: "",
  investmentParticipation: "",
  investmentTimeline: "",
  investmentBudget: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  website: "",
};

const STEPS = [
  {
    id: "investmentBudget",
    type: "choice",
    title: "What is your investment budget?",
    subtitle: "Select the range that best matches the capital you are prepared to commit.",
    disclaimer:
      "We are focused on serious partners prepared to invest $100K or more.",
    options: [
      { value: "100k_200k", label: "$100K to $200K" },
      { value: "250k_500k", label: "$250K to $500K" },
      { value: "500k_1m", label: "$500K to $1M" },
      { value: "1m_plus", label: "$1M+" },
      { value: "not_a_fit", label: "I'm not a fit", variant: "muted" },
    ],
  },
  {
    id: "salesBackground",
    type: "choice",
    title: "Do you have a background in sales?",
    subtitle:
      "We’re expanding into new markets and want to understand your experience.",
    options: [
      { value: "yes_professional", label: "Yes, professional sales experience" },
      { value: "yes_some", label: "Some: retail, referrals, or part-time" },
      { value: "no", label: "No sales background" },
    ],
  },
  {
    id: "investmentParticipation",
    type: "choice",
    title: "How do you plan to participate?",
    options: [
      { value: "active", label: "Active, hands-on (markets, introductions, operations)" },
      { value: "passive", label: "Passive, capital only" },
      { value: "either", label: "Open to either" },
    ],
  },
  {
    id: "investmentTimeline",
    type: "choice",
    title: "What is your investing timeline?",
    options: [
      { value: "0_3_months", label: "Next 0-3 months" },
      { value: "3_6_months", label: "3-6 months" },
      { value: "6_12_months", label: "6-12 months" },
      { value: "12_plus", label: "12+ months / undecided" },
    ],
  },
  {
    id: "contact",
    type: "contact",
    title: "Where should we send investor information?",
    subtitle:
      "A member of the Solve Energy team will follow up about our expansion opportunity.",
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
    if (step.type === "text" || step.type === "textarea") {
      return Boolean(form[step.id]?.trim());
    }
    return Boolean(form[step.id]);
  }

  async function handleNext() {
    if (!canContinue()) {
      setError("Please complete this step to continue.");
      return;
    }

    if (step.id === "investmentBudget" && form.investmentBudget === "not_a_fit") {
      router.replace("/connect/not-a-fit");
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
      setStoredLead({
        eventId: result.eventId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone,
      });
      router.replace("/connect/video");
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
        <p className="eyebrow stage-label">Step 1 of 3</p>
        <h1>{step.title}</h1>
        {step.subtitle && <p className="lead">{step.subtitle}</p>}
        {step.disclaimer && <p className="survey-disclaimer">{step.disclaimer}</p>}
        {step.hint && <p className="hint">{step.hint}</p>}

        {step.type === "choice" && (
          <ul className="choice-list" role="list">
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
              : step.id === "investmentBudget" && form.investmentBudget === "not_a_fit"
                ? "Close"
                : stepIndex === STEPS.length - 1
                  ? "Continue"
                  : "Continue"}
          </button>
        </div>
      </div>
    </SurveyShell>
  );
}
