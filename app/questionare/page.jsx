import { Suspense } from "react";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import SurveyShell from "@/components/SurveyShell";

export const metadata = {
  title: "Partner questionnaire",
  description:
    "Partner questionnaire for Solve Energy. Complete after booking or via link from our team.",
};

function QuestionnaireLoading() {
  return (
    <SurveyShell compact progress={100}>
      <div className="survey-step">
        <p className="lead">Loading…</p>
      </div>
    </SurveyShell>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<QuestionnaireLoading />}>
      <QuestionnaireForm />
    </Suspense>
  );
}
