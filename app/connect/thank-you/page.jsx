import ThankYouPage from "@/components/ThankYouPage";
import { thankYouShowVideo } from "@/lib/thankYouFeatures";

const showVideo = thankYouShowVideo();

export const metadata = {
  title: showVideo ? "Video and booking" : "Book your call",
  description: showVideo
    ? "Watch the Solve Energy overview and book your investor partnership call with our team."
    : "Book your investor partnership call with the Solve Energy partnerships team.",
};

export default function ConnectThankYou() {
  return <ThankYouPage />;
}
