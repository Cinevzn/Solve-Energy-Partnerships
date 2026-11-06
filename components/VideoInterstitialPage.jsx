"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyShell from "@/components/SurveyShell";
import { getStoredLead, setVideoGatePassed } from "@/lib/leadSession";

const VIDEO_URL = process.env.NEXT_PUBLIC_BOOKING_VIDEO_URL?.trim();

export default function VideoInterstitialPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getStoredLead()) {
      router.replace("/connect");
      return;
    }
    setReady(true);
  }, [router]);

  function handleContinue() {
    setVideoGatePassed();
    router.push("/connect/profile");
  }

  if (!ready) {
    return (
      <SurveyShell compact>
        <p className="lead">Loading…</p>
      </SurveyShell>
    );
  }

  return (
    <SurveyShell compact progress={66}>
      <div className="survey-step thank-you">
        <p className="eyebrow stage-label">Before step 2</p>
        <h1>Partner overview</h1>
        <p className="lead">
          Thanks for sharing your details. Watch this short overview of Solve
          Energy&apos;s expansion opportunity, then continue to complete your investor
          profile.
        </p>

        <div className="video-wrap">
          {VIDEO_URL ? (
            <iframe
              title="Solve Energy partner overview"
              src={VIDEO_URL}
              className="video-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="video-placeholder" aria-label="Video placeholder">
              <span className="video-placeholder-icon" aria-hidden="true">
                ▶
              </span>
              <p className="video-placeholder-title">Partner overview video</p>
              <p className="video-placeholder-copy">
                Your overview video will appear here. Set{" "}
                <code>NEXT_PUBLIC_BOOKING_VIDEO_URL</code> to your embed URL (YouTube,
                Vimeo, etc.).
              </p>
            </div>
          )}
        </div>

        <div className="nav-row video-continue-row">
          <span />
          <button type="button" className="btn primary" onClick={handleContinue}>
            Continue to step 2
          </button>
        </div>
      </div>
    </SurveyShell>
  );
}
