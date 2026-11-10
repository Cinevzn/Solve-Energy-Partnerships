"use client";

import Image from "next/image";
import Link from "next/link";
import SurveyShell from "@/components/SurveyShell";

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL?.trim();
const VIDEO_URL = process.env.NEXT_PUBLIC_BOOKING_VIDEO_URL?.trim();
const BOOKING_SECTION_ID = "book-investor-partnership-call";

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

function scrollToBooking(e) {
  e.preventDefault();
  document.getElementById(BOOKING_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ThankYouPage() {
  return (
    <SurveyShell compact progress={100}>
      <div className="thank-you">
        <p className="eyebrow stage-label">Step 2 of 3</p>
        <h1>Watch the overview, then book your investor partnership call</h1>
        <p className="lead thank-you-lead">
          You&apos;re one step away from speaking with our team. Skim the video, then lock in a time to
          talk through your market and next steps.
        </p>

        <div className="thank-you-booking-banner" role="region" aria-label="Book an investor partnership call">
          <p className="thank-you-booking-banner-kicker">Next up</p>
          <p className="thank-you-booking-banner-title">Schedule your investor partnership call</p>
          <p className="thank-you-booking-banner-copy">
            Pick a time below. We&apos;ll confirm by email and come prepared for your market and goals.
          </p>
          <a href={`#${BOOKING_SECTION_ID}`} className="btn primary thank-you-booking-banner-btn" onClick={scrollToBooking}>
            Book my investor partnership call
          </a>
        </div>

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

        <div className="thank-you-cta-row">
          <a href={`#${BOOKING_SECTION_ID}`} className="btn primary thank-you-scroll-cta" onClick={scrollToBooking}>
            Jump to calendar — book your investor partnership call
          </a>
        </div>

        <section
          id={BOOKING_SECTION_ID}
          className="thank-you-booking-block"
          aria-labelledby="thank-you-booking-heading"
        >
          <h2 id="thank-you-booking-heading" className="thank-you-subhead thank-you-booking-title">
            Book your investor partnership call
          </h2>
          <ul className="thank-you-booking-perks" role="list">
            <li>~20 minutes with our partnership team</li>
            <li>Discuss the market you selected and what partnership looks like</li>
            <li>No obligation — clarity on whether Solve is the right fit</li>
          </ul>
          <a
            href={`#${BOOKING_SECTION_ID}-calendar`}
            className="btn primary thank-you-booking-inline-cta"
          >
            Choose a time
          </a>

          <div id={`${BOOKING_SECTION_ID}-calendar`} className="calendar-wrap">
            {CALENDAR_URL ? (
              <iframe
                title="Book an investor partnership call with Solve Energy"
                src={CALENDAR_URL}
                className="calendar-iframe"
                loading="lazy"
              />
            ) : (
              <div className="calendar-placeholder">
                <p>
                  Calendar embed will appear here once{" "}
                  <code>NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL</code> is configured with your booking
                  link.
                </p>
              </div>
            )}
          </div>
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

        <section className="team-strip team-strip-featured" aria-labelledby="team-strip-heading">
          <h2 id="team-strip-heading" className="team-strip-heading team-strip-heading-featured">
            Meet part of our team
          </h2>
          <p className="team-strip-lead">
            Partnership at Solve is people-first. These are a few of the folks you may hear from after you
            book your investor partnership call.
          </p>
          <ul className="team-strip-grid team-strip-grid-featured" role="list">
            {TEAM_PHOTOS.map((photo) => (
              <li key={photo.src} className="team-strip-item">
                <div className="team-strip-photo-wrap team-strip-photo-wrap-featured">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="team-strip-photo"
                    sizes="(max-width: 640px) 85vw, (max-width: 899px) 45vw, (max-width: 1199px) 30vw, 280px"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="thank-you-cta-row thank-you-cta-row-end">
            <a href={`#${BOOKING_SECTION_ID}`} className="btn primary thank-you-scroll-cta" onClick={scrollToBooking}>
              Still need a time? Book your investor partnership call
            </a>
          </div>
        </section>

        <p className="fine-print">
          Solve Energy · Victoria · Langley · Kelowna ·{" "}
          <a href="tel:+18886676583">1-888-667-6583</a>
        </p>
      </div>
    </SurveyShell>
  );
}
