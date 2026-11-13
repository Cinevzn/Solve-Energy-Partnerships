"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import { readLeadSession } from "@/lib/leadSession";
import { formatPhoneDisplay, isCompleteUsPhone, phoneDigitsOnly } from "@/lib/phone";
import { submitQuestionnaire } from "@/lib/submitQuestionnaire";
import { thankYouShowVideo } from "@/lib/thankYouFeatures";

const Q1_OPTIONS = [
  { value: "hands_on_run_market", label: "I want to be hands on and run it" },
  { value: "invest_solve_team", label: "I want to invest and have Solve run it" },
  { value: "unsure_both", label: "Still not sure, I want to understand both" },
];

const Q9_HANDS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "1_to_5", label: "1 to 5" },
  { value: "6_to_20", label: "6 to 20" },
  { value: "21_to_50", label: "21 to 50" },
  { value: "50_plus", label: "50+" },
];

const Q10_HANDS_OPTIONS = [
  { value: "sales", label: "Sales" },
  { value: "ops_install", label: "Operations and install" },
  { value: "whole_thing", label: "The whole thing" },
  { value: "not_sure", label: "Not sure yet" },
];

const Q9_INVEST_OPTIONS = [
  { value: "reporting_only", label: "Reporting only" },
  { value: "regular_call", label: "A regular call" },
  { value: "big_decisions", label: "A say on the big decisions" },
];

function emptyForm() {
  return {
    leadEventId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    q1ThinkingChanged: "",
    q2CurrentRoleShort: "",
    q3BusinessHistoryLong: "",
    q4HopeLong: "",
    q5SayNoLong: "",
    q6MoneySitLong: "",
    q7PrivateInvestLong: "",
    q8DecisionOthersShort: "",
    q9PeopleResponsible: "",
    q10DayToDayOwn: "",
    q11SolveSetsStandardsLong: "",
    q12HoursPerWeekShort: "",
    q9InvolvementLevel: "",
    q10BeforeCallLong: "",
    q13SolarRoofEnergy: "",
    q13SolarRoofEnergyDetail: "",
    q14NonCompete: "",
    q14NonCompeteDetail: "",
    q15BankruptcyLitigation: "",
    q15BankruptcyLitigationDetail: "",
    q16References: "",
    q17CallPrepLong: "",
    website: "",
  };
}

const LEAD_EVENT_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeLeadEventId(raw) {
  const id = raw?.trim() ?? "";
  if (!id) return "";
  return LEAD_EVENT_ID_RE.test(id) ? id : "";
}

function contactComplete(f) {
  return (
    Boolean(f.firstName?.trim()) &&
    Boolean(f.lastName?.trim()) &&
    Boolean(f.email?.trim()) &&
    isCompleteUsPhone(f.phone)
  );
}

export default function QuestionnaireForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const session = readLeadSession();
    const first = searchParams.get("firstName")?.trim();
    const last = searchParams.get("lastName")?.trim();
    const email = searchParams.get("email")?.trim();
    const phoneRaw = searchParams.get("phone")?.trim();
    const leadId =
      searchParams.get("leadEventId")?.trim() ?? searchParams.get("event_id")?.trim();

    setForm((prev) => {
      let next = { ...prev };
      if (session) {
        next = {
          ...next,
          leadEventId: session.eventId,
          firstName: session.firstName,
          lastName: session.lastName,
          email: session.email,
          phone: formatPhoneDisplay(session.phoneDigits),
        };
      }
      if (first) next.firstName = first;
      if (last) next.lastName = last;
      if (email) next.email = email;
      if (phoneRaw) next.phone = formatPhoneDisplay(phoneRaw);
      if (leadId) next.leadEventId = leadId;
      return next;
    });
    setHydrated(true);
  }, [searchParams]);

  const showContactFields = hydrated && !contactComplete(form);

  const branch = form.q1ThinkingChanged;
  const handsBranch =
    branch === "hands_on_run_market" || branch === "unsure_both";
  const investBranch = branch === "invest_solve_team";

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  /** Q1 selects branch: Q9–12 hands/unsure only; Q9–10 invest only. Clear the other branch when switching. */
  function setQ1Branch(value) {
    setForm((prev) => {
      const next = { ...prev, q1ThinkingChanged: value };
      if (value === "invest_solve_team") {
        next.q9PeopleResponsible = "";
        next.q10DayToDayOwn = "";
        next.q11SolveSetsStandardsLong = "";
        next.q12HoursPerWeekShort = "";
      } else {
        next.q9InvolvementLevel = "";
        next.q10BeforeCallLong = "";
      }
      return next;
    });
    setError("");
  }

  function validateClient() {
    if (!form.firstName.trim()) return "Please enter your first name.";
    if (!form.lastName.trim()) return "Please enter your last name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!isCompleteUsPhone(form.phone)) return "Please enter a valid 10-digit phone number.";
    if (!form.q1ThinkingChanged) return "Please answer question 1.";
    if (handsBranch) {
      if (!form.q9PeopleResponsible) return "Please answer question 9.";
      if (!form.q10DayToDayOwn) return "Please answer question 10.";
    }
    if (investBranch) {
      if (!form.q9InvolvementLevel) return "Please answer question 9.";
    }
    if (!form.q13SolarRoofEnergy) return "Please answer question 13.";
    if (form.q13SolarRoofEnergy === "yes" && !form.q13SolarRoofEnergyDetail.trim()) {
      return "Please add details for question 13.";
    }
    if (!form.q14NonCompete) return "Please answer question 14.";
    if (form.q14NonCompete === "yes" && !form.q14NonCompeteDetail.trim()) {
      return "Please add details for question 14.";
    }
    if (!form.q15BankruptcyLitigation) return "Please answer question 15.";
    if (form.q15BankruptcyLitigation === "yes" && !form.q15BankruptcyLitigationDetail.trim()) {
      return "Please add details for question 15.";
    }
    if (!form.q16References) return "Please answer question 16.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validateClient();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitQuestionnaire({
        ...form,
        leadEventId: normalizeLeadEventId(form.leadEventId),
        phoneDigits: phoneDigitsOnly(form.phone),
      });
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePhoneChange(raw) {
    setField("phone", formatPhoneDisplay(raw));
  }

  if (!hydrated) {
    return (
      <SurveyShell compact progress={100}>
        <div className="survey-step">
          <p className="lead">Loading…</p>
        </div>
      </SurveyShell>
    );
  }

  if (done) {
    return (
      <SurveyShell compact progress={100}>
        <div className="survey-step questionnaire-done">
          <p className="eyebrow stage-label">Step 3 of 3</p>
          <h1>Thank you</h1>
          <p className="lead">
            Your answers are saved. We&apos;ll be ready for your call. You can close this page or return
            to the{" "}
            <Link href="/">home page</Link>.
          </p>
        </div>
      </SurveyShell>
    );
  }

  return (
    <SurveyShell compact progress={100}>
      <form className="survey-step questionnaire-page" onSubmit={handleSubmit} noValidate>
        <p className="eyebrow stage-label">Step 3 of 3 · Partner questionnaire</p>
        <h1>A few more questions</h1>
        <p className="lead">
          Please complete this questionnaire so we can better understand your background, goals, and fit as an
          investor partner before your call. Some questions are required; others are optional.
          {showContactFields
            ? " Add your contact details below if we do not already have them on file."
            : " We already have your contact details from your application."}
        </p>

        {!showContactFields ? (
          <div className="questionnaire-contact-card" aria-label="Your contact information">
            <p>
              <strong>
                {form.firstName} {form.lastName}
              </strong>
            </p>
            <p className="questionnaire-contact-meta">{form.email}</p>
            <p className="questionnaire-contact-meta">{formatPhoneDisplay(form.phone)}</p>
          </div>
        ) : (
          <div className="contact-form contact-card questionnaire-contact-fields">
            <div className="field-row">
              <label>
                First name
                <input
                  type="text"
                  autoComplete="given-name"
                  required
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  autoComplete="family-name"
                  required
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
                required
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
                required
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  handlePhoneChange(e.clipboardData.getData("text"));
                }}
              />
            </label>
          </div>
        )}

        <fieldset className="q-fieldset">
          <legend className="q-legend">
            <span className="q-num">1.</span> Since you filled in the first form, has your thinking
            changed?
          </legend>
          <ul className="choice-list questionnaire-choice-list" role="list">
            {Q1_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`choice-btn ${form.q1ThinkingChanged === opt.value ? "selected" : ""}`}
                  onClick={() => setQ1Branch(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </fieldset>

        <section className="q-block">
          <label className="q-label" htmlFor="q2">
            <span className="q-num">2.</span> What do you do now, and how long have you been doing
            it? <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q2"
            name="q2CurrentRoleShort"
            rows={3}
            maxLength={5000}
            value={form.q2CurrentRoleShort}
            onChange={(e) => setField("q2CurrentRoleShort", e.target.value)}
            className="q-textarea"
          />
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q3">
            <span className="q-num">3.</span> Have you owned or run a business? If so, what was it,
            roughly how big it got, and what happened to it.{" "}
            <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q3"
            name="q3BusinessHistoryLong"
            rows={5}
            maxLength={8000}
            value={form.q3BusinessHistoryLong}
            onChange={(e) => setField("q3BusinessHistoryLong", e.target.value)}
            className="q-textarea"
          />
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q4">
            <span className="q-num">4.</span> What are you hoping this does for you?{" "}
            <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q4"
            name="q4HopeLong"
            rows={5}
            maxLength={8000}
            value={form.q4HopeLong}
            onChange={(e) => setField("q4HopeLong", e.target.value)}
            className="q-textarea"
          />
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q5">
            <span className="q-num">5.</span> What would make you say no to this?{" "}
            <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q5"
            name="q5SayNoLong"
            rows={5}
            maxLength={8000}
            value={form.q5SayNoLong}
            onChange={(e) => setField("q5SayNoLong", e.target.value)}
            className="q-textarea"
          />
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q6">
            <span className="q-num">6.</span> Where does the money sit today, and what would have to
            happen for it to be available? <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q6"
            name="q6MoneySitLong"
            rows={5}
            maxLength={8000}
            value={form.q6MoneySitLong}
            onChange={(e) => setField("q6MoneySitLong", e.target.value)}
            className="q-textarea"
          />
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q7">
            <span className="q-num">7.</span> Have you put money into a private business before? How
            did that go? <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q7"
            name="q7PrivateInvestLong"
            rows={5}
            maxLength={8000}
            value={form.q7PrivateInvestLong}
            onChange={(e) => setField("q7PrivateInvestLong", e.target.value)}
            className="q-textarea"
          />
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q8">
            <span className="q-num">8.</span> Who else is part of this decision?{" "}
            <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q8"
            name="q8DecisionOthersShort"
            rows={3}
            maxLength={5000}
            value={form.q8DecisionOthersShort}
            onChange={(e) => setField("q8DecisionOthersShort", e.target.value)}
            className="q-textarea"
          />
        </section>

        {handsBranch ? (
          <>
            <fieldset className="q-fieldset">
              <legend className="q-legend">
                <span className="q-num">9.</span> What is the largest number of people you have been
                directly responsible for?
              </legend>
              <ul className="choice-list questionnaire-choice-list" role="list">
                {Q9_HANDS_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`choice-btn ${form.q9PeopleResponsible === opt.value ? "selected" : ""}`}
                      onClick={() => setField("q9PeopleResponsible", opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset className="q-fieldset">
              <legend className="q-legend">
                <span className="q-num">10.</span> Which part would you want to own day to day?
              </legend>
              <ul className="choice-list questionnaire-choice-list" role="list">
                {Q10_HANDS_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`choice-btn ${form.q10DayToDayOwn === opt.value ? "selected" : ""}`}
                      onClick={() => setField("q10DayToDayOwn", opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <section className="q-block">
              <label className="q-label" htmlFor="q11">
                <span className="q-num">11.</span> Solve sets the pricing, the process and the
                standards, and the market runs on them. How do you feel about that?{" "}
                <span className="q-optional">(optional)</span>
              </label>
              <textarea
                id="q11"
                name="q11SolveSetsStandardsLong"
                rows={5}
                maxLength={8000}
                value={form.q11SolveSetsStandardsLong}
                onChange={(e) => setField("q11SolveSetsStandardsLong", e.target.value)}
                className="q-textarea"
              />
            </section>

            <section className="q-block">
              <label className="q-label" htmlFor="q12">
                <span className="q-num">12.</span> How many hours a week could you put into this, and
                what else would be competing for your time?{" "}
                <span className="q-optional">(optional)</span>
              </label>
              <textarea
                id="q12"
                name="q12HoursPerWeekShort"
                rows={3}
                maxLength={5000}
                value={form.q12HoursPerWeekShort}
                onChange={(e) => setField("q12HoursPerWeekShort", e.target.value)}
                className="q-textarea"
              />
            </section>
          </>
        ) : null}

        {investBranch ? (
          <>
            <fieldset className="q-fieldset">
              <legend className="q-legend">
                <span className="q-num">9.</span> How involved do you want to be?
              </legend>
              <ul className="choice-list questionnaire-choice-list" role="list">
                {Q9_INVEST_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`choice-btn ${form.q9InvolvementLevel === opt.value ? "selected" : ""}`}
                      onClick={() => setField("q9InvolvementLevel", opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <section className="q-block">
              <label className="q-label" htmlFor="q10invest">
                <span className="q-num">10.</span> Is there anything you want explained before the
                call? <span className="q-optional">(optional)</span>
              </label>
              <textarea
                id="q10invest"
                name="q10BeforeCallLong"
                rows={5}
                maxLength={8000}
                value={form.q10BeforeCallLong}
                onChange={(e) => setField("q10BeforeCallLong", e.target.value)}
                className="q-textarea"
              />
            </section>
          </>
        ) : null}

        <section className="q-block q-block-required">
          <fieldset className="q-yesno-fieldset">
            <legend className="q-label">
              <span className="q-num">13.</span> Do you currently have, or have you had, any
              involvement in a solar, roofing or energy business?
            </legend>
            <div className="q-yesno-row">
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q13SolarRoofEnergy === "no" ? "selected" : ""}`}
                onClick={() => {
                  setField("q13SolarRoofEnergy", "no");
                  setField("q13SolarRoofEnergyDetail", "");
                }}
              >
                No
              </button>
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q13SolarRoofEnergy === "yes" ? "selected" : ""}`}
                onClick={() => setField("q13SolarRoofEnergy", "yes")}
              >
                Yes
              </button>
            </div>
          </fieldset>
          {form.q13SolarRoofEnergy === "yes" ? (
            <label className="q-sublabel" htmlFor="q13detail">
              Please describe
              <textarea
                id="q13detail"
                rows={3}
                maxLength={5000}
                value={form.q13SolarRoofEnergyDetail}
                onChange={(e) => setField("q13SolarRoofEnergyDetail", e.target.value)}
                className="q-textarea"
              />
            </label>
          ) : null}
        </section>

        <section className="q-block q-block-required">
          <fieldset className="q-yesno-fieldset">
            <legend className="q-label">
              <span className="q-num">14.</span> Are you subject to any non-compete or non-solicit
              agreement?
            </legend>
            <div className="q-yesno-row">
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q14NonCompete === "no" ? "selected" : ""}`}
                onClick={() => {
                  setField("q14NonCompete", "no");
                  setField("q14NonCompeteDetail", "");
                }}
              >
                No
              </button>
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q14NonCompete === "yes" ? "selected" : ""}`}
                onClick={() => setField("q14NonCompete", "yes")}
              >
                Yes
              </button>
            </div>
          </fieldset>
          {form.q14NonCompete === "yes" ? (
            <label className="q-sublabel" htmlFor="q14detail">
              Please describe
              <textarea
                id="q14detail"
                rows={3}
                maxLength={5000}
                value={form.q14NonCompeteDetail}
                onChange={(e) => setField("q14NonCompeteDetail", e.target.value)}
                className="q-textarea"
              />
            </label>
          ) : null}
        </section>

        <section className="q-block q-block-required">
          <fieldset className="q-yesno-fieldset">
            <legend className="q-label">
              <span className="q-num">15.</span> Has any business you have owned or run been through
              bankruptcy or receivership, or had a judgment, litigation or regulatory action against it?
            </legend>
            <div className="q-yesno-row">
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q15BankruptcyLitigation === "no" ? "selected" : ""}`}
                onClick={() => {
                  setField("q15BankruptcyLitigation", "no");
                  setField("q15BankruptcyLitigationDetail", "");
                }}
              >
                No
              </button>
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q15BankruptcyLitigation === "yes" ? "selected" : ""}`}
                onClick={() => setField("q15BankruptcyLitigation", "yes")}
              >
                Yes
              </button>
            </div>
          </fieldset>
          {form.q15BankruptcyLitigation === "yes" ? (
            <label className="q-sublabel" htmlFor="q15detail">
              Please describe
              <textarea
                id="q15detail"
                rows={3}
                maxLength={5000}
                value={form.q15BankruptcyLitigationDetail}
                onChange={(e) => setField("q15BankruptcyLitigationDetail", e.target.value)}
                className="q-textarea"
              />
            </label>
          ) : null}
        </section>

        <section className="q-block q-block-required">
          <fieldset className="q-yesno-fieldset">
            <legend className="q-label">
              <span className="q-num">16.</span> If this progresses, would you be able to provide
              references?
            </legend>
            <div className="q-yesno-row">
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q16References === "no" ? "selected" : ""}`}
                onClick={() => setField("q16References", "no")}
              >
                No
              </button>
              <button
                type="button"
                className={`choice-btn choice-btn-inline ${form.q16References === "yes" ? "selected" : ""}`}
                onClick={() => setField("q16References", "yes")}
              >
                Yes
              </button>
            </div>
          </fieldset>
        </section>

        <section className="q-block">
          <label className="q-label" htmlFor="q17">
            <span className="q-num">17.</span> Anything you want us ready to answer on the call?{" "}
            <span className="q-optional">(optional)</span>
          </label>
          <textarea
            id="q17"
            name="q17CallPrepLong"
            rows={5}
            maxLength={8000}
            value={form.q17CallPrepLong}
            onChange={(e) => setField("q17CallPrepLong", e.target.value)}
            className="q-textarea"
          />
        </section>

        <label className="hp" aria-hidden="true">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
          />
        </label>

        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="nav-row questionnaire-submit-row">
          <Link href="/connect/thank-you" className="btn ghost">
            {thankYouShowVideo() ? "Back to video and booking" : "Back to booking"}
          </Link>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit questionnaire"}
          </button>
        </div>
      </form>
    </SurveyShell>
  );
}
