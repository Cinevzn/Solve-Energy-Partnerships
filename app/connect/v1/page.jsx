import SurveyPage from "@/components/SurveyPage";
import { thankYouShowVideo } from "@/lib/thankYouFeatures";

const showVideo = thankYouShowVideo();

export const metadata = {
  title: "Partner questionnaire (list)",
  description: showVideo
    ? "Answer a few questions about your market, capital, and timing. Next, watch an overview and book a call with Solve Energy."
    : "Answer a few questions about your market, capital, and timing. Next, book your investor partnership call with Solve Energy.",
};

export default function ConnectV1Page() {
  return <SurveyPage />;
}
