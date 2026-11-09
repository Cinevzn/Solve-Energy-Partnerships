"use client";

import Image from "next/image";
import Link from "next/link";
import SurveyShell from "@/components/SurveyShell";

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL?.trim();
const VIDEO_URL = process.env.NEXT_PUBLIC_BOOKING_VIDEO_URL?.trim();

const TEAM_PHOTOS = [
  {
    src: "https://assets.cdn.filesafe.space/1cnqPfm56RHZ8BgjIGp0/media/6aedffc24f032473ba8f717f.png",
    alt: "Solve Energy team",
  },
  {
    src: "https://assets.cdn.filesafe.space/1cnqPfm56RHZ8BgjIGp0/media/6aedffc2e322309abf069db0.png",
    alt: "Solve Energy team",
  },
  {
    src: "https://assets.cdn.filesafe.space/1cnqPfm56RHZ8BgjIGp0/media/6aedffc242ff25478cf79669.png",
    alt: "Solve Energy team",
  },
  {
    src: "https://assets.cdn.filesafe.space/1cnqPfm56RHZ8BgjIGp0/media/6aedffc20c8a41402c1a8b42.png",
    alt: "Solve Energy team",
  },
  {
    src: "https://assets.cdn.filesafe.space/1cnqPfm56RHZ8BgjIGp0/media/6aedffc231d623e532f71866.png",
    alt: "Solve Energy team",
  },
];

export default function ThankYouPage() {
  return (
    <SurveyShell compact progress={100}>
      <div className="thank-you">
        <p className="eyebrow stage-label">Step 2 of 3</p>
        <h1>Watch and book a call</h1>
        <p className="lead">
          Thanks for your answers. Review the overview below, then choose a time to speak
          with our team about your market of interest.
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
                Add your video URL in{" "}
                <code>NEXT_PUBLIC_BOOKING_VIDEO_URL</code> (YouTube embed, Vimeo, etc.).
              </p>
            </div>
          )}
        </div>

        <h2 className="thank-you-subhead">Book your call</h2>

        <div className="calendar-wrap">
          {CALENDAR_URL ? (
            <iframe
              title="Book a call with Solve Energy"
              src={CALENDAR_URL}
              className="calendar-iframe"
              loading="lazy"
            />
          ) : (
            <div className="calendar-placeholder">
              <p>
                Calendar embed will appear here once{" "}
                <code>NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL</code> is configured with your
                booking link.
              </p>
            </div>
          )}
        </div>

        <section className="team-strip" aria-labelledby="team-strip-heading">
          <h2 id="team-strip-heading" className="team-strip-heading">
            Meet part of our team
          </h2>
          <p className="team-strip-lead">
            Partnership at Solve is people-first. Here are a few of the folks you may hear from as we
            explore your market together.
          </p>
          <ul className="team-strip-grid" role="list">
            {TEAM_PHOTOS.map((photo) => (
              <li key={photo.src} className="team-strip-item">
                <div className="team-strip-photo-wrap">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="team-strip-photo"
                    sizes="(max-width: 640px) 42vw, (max-width: 899px) 28vw, (max-width: 1199px) 18vw, 220px"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="thank-you-next" aria-labelledby="thank-you-next-heading">
          <h2 id="thank-you-next-heading" className="thank-you-subhead">
            Step 3: Partner questionnaire
          </h2>
          <p className="thank-you-next-copy">
            After you choose a time, continue to a short questionnaire so we can tailor the call. You can
            also open this link from email if we send it from our team.
          </p>
          <Link href="/questionare" className="btn primary thank-you-next-cta">
            Continue to questionnaire
          </Link>
        </section>

        <p className="fine-print">
          Solve Energy · Victoria · Langley · Kelowna ·{" "}
          <a href="tel:+18886676583">1-888-667-6583</a>
        </p>
      </div>
    </SurveyShell>
  );
}
