"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import {
  clearStoredLead,
  getStoredLead,
  hasVideoGatePassed,
} from "@/lib/leadSession";
import { submitProfile } from "@/lib/submitProfile";

const BACKGROUND_MIN_LENGTH = 150;

const INITIAL = {
  location: "",
  willingToRelocate: "",
  investorBackground: "",
  website: "",
};

const STEPS = [
  {
    id: "location",
    type: "text",
    title: "Where do you currently live?",
    placeholder: "City and province or state",
  },
  {
    id: "willingToRelocate",
    type: "choice",
    title: "Are you willing to relocate for the right opportunity?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "open_to_discuss", label: "Open to discuss" },
      { value: "remote_only", label: "Remote / capital only, no relocation" },
    ],
  },
  {
    id: "investorBackground",
    type: "textarea",
    title: "Tell us about you",
    subtitle:
      "The more we know, the better we can prepare for your call. Please take a few minutes to introduce yourself in your own words.",
    minLength: BACKGROUND_MIN_LENGTH,
    prompts: [
      "Your professional background and what you do today",
      "Past investing or partnership experience (industries, deal sizes, outcomes)",
      "Why Solve Energy and clean energy expansion interest you",
      "What role you want to play and what you are hoping to get from this opportunity",
    ],
    placeholder: "Share your background and what you are looking for.",
  },
];

export default function ProfileSurveyPage() {
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredLead();
    if (!stored) {
      router.replace("/connect");
      return;
    }
    if (!hasVideoGatePassed()) {
      router.replace("/connect/video");
      return;
    }
    setLead(stored);
  }, [router]);

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
    if (step.type === "textarea") {
      const len = form[step.id]?.trim().length ?? 0;
      const min = step.minLength ?? 1;
      return len >= min;
    }
    if (step.type === "text") {
      return Boolean(form[step.id]?.trim());
    }
    return Boolean(form[step.id]);
  }

  async function handleNext() {
    if (!canContinue()) {
      if (step.type === "textarea" && step.minLength) {
        setError(
          `Please share a bit more about yourself (at least ${step.minLength} characters).`,
        );
      } else {
        setError("Please complete this step to continue.");
      }
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    if (!lead) return;

    setSubmitting(true);
    setError("");
    try {
      await submitProfile({
        parentEventId: lead.eventId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        location: form.location.trim(),
        willingToRelocate: form.willingToRelocate,
        investorBackground: form.investorBackground.trim(),
        website: form.website,
      });
      clearStoredLead();
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

  function handleSkip() {
    clearStoredLead();
    router.replace("/connect/thank-you");
  }

  if (!lead) {
    return (
      <SurveyShell compact>
        <p className="lead">Loading…</p>
      </SurveyShell>
    );
  }

  return (
    <SurveyShell progress={progress} stepNumber={stepIndex + 1} totalSteps={STEPS.length}>
      <div className="survey-step">
        <p className="eyebrow stage-label">Step 2 of 3</p>
        <h1>{step.title}</h1>
        {step.subtitle && <p className="lead">{step.subtitle}</p>}

        {step.type === "text" && (
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            <label>
              Location
              <input
                type="text"
                autoComplete="address-level2"
                placeholder={step.placeholder}
                value={form[step.id]}
                onChange={(e) => setField(step.id, e.target.value)}
              />
            </label>
          </form>
        )}

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

        {step.type === "textarea" && step.prompts && (
          <ul className="textarea-prompts" aria-label="Suggested topics to include">
            {step.prompts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {step.type === "textarea" && (
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            <label>
              Your story
              <textarea
                rows={9}
                placeholder={step.placeholder}
                value={form.investorBackground}
                onChange={(e) => setField("investorBackground", e.target.value)}
              />
              <span
                className={`char-count ${(form.investorBackground?.trim().length ?? 0) >= (step.minLength ?? 0) ? "char-count-ok" : ""}`}
                aria-live="polite"
              >
                {form.investorBackground?.trim().length ?? 0} / {step.minLength} characters
                minimum
              </span>
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
            <button type="button" className="btn ghost" onClick={handleSkip} disabled={submitting}>
              Skip for now
            </button>
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
                ? "Submit profile"
                : "Continue"}
          </button>
        </div>

        <p className="fine-print profile-skip-note">
          <Link href="/connect/thank-you" onClick={() => clearStoredLead()}>
            Go to step 3 without completing your profile
          </Link>
        </p>
      </div>
    </SurveyShell>
  );
}
