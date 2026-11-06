"use client";

import SurveyFlow from "@/components/SurveyFlow";
import { buildSurveySteps } from "@/components/surveySteps";

export default function SurveyPage() {
  return <SurveyFlow steps={buildSurveySteps("list")} surveyVersion="v1" />;
}
