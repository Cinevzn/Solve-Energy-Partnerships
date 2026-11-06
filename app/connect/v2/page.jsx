import SurveyFlow from "@/components/SurveyFlow";
import { buildSurveySteps } from "@/components/surveySteps";

export const metadata = {
  title: "Partner questionnaire (map)",
  description:
    "Select your market on a map and share capital and timing details. Next, watch an overview and book a call with Solve Energy.",
};

export default function ConnectV2() {
  return <SurveyFlow steps={buildSurveySteps("map")} surveyVersion="v2" />;
}
