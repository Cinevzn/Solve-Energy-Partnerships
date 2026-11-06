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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  website: "",
};

const STEPS = [
  {
    id: "salesBackground",
    type: "choice",
    title: "Do you have a background in sales?",
    subtitle:
      "We’re expanding into new markets and want to understand your experience.",
    options: [
      { value: "yes_professional", label: "Yes — professional sales experience" },
      { value: "yes_some", label: "Some — retail, referrals, or part-time" },
      { value: "no", label: "No sales background" },
    ],
  },
  {
    id: "investmentParticipation",
    type: "choice",
    title: "How do you plan to participate?",
    options: [
      { value: "active", label: "Active — hands-on (markets, introductions, operations)" },
      { value: "passive", label: "Passive — capital only" },
      { value: "either", label: "Open to either" },
    ],
  },
  {
    id: "investmentTimeline",
    type: "choice",
    title: "What is your investing timeline?",
    options: [
      { value: "0_3_months", label: "Next 0–3 months" },
      { value: "3_6_months", label: "3–6 months" },
      { value: "6_12_months", label: "6–12 months" },
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
      router.replace("/connect/profile");
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
                ? "Continue"
                : "Continue"}
          </button>
        </div>
      </div>
    </SurveyShell>
  );
}
