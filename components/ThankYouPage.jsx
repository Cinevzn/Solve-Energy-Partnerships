"use client";

import Image from "next/image";
import Link from "next/link";
import SurveyShell from "@/components/SurveyShell";

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_EMBED_URL?.trim();
const VIDEO_URL = process.env.NEXT_PUBLIC_BOOKING_VIDEO_URL?.trim();
const BOOKING_SECTION_ID = "book-investor-partnership-call";

const TRACK_RECORD = [
  { value: "1,500+", label: "Solar systems installed" },
  { value: "$20M+", label: "Revenue scale, company-wide" },
  { value: "300+", label: "Five-star reviews" },
  { value: "3", label: "Markets running today" },
];

const PARTNERSHIP_HIGHLIGHTS = [
  {
    title: "One partner, one market",
    body: "Each expansion market is offered once. Your interest is in the entity that owns that market; terms are agreed in a term sheet.",
  },
  {
    title: "Run it or stay passive",
    body: "Hands-on operators and investor-only partners can both qualify. Ownership structure is the same; your level of day-to-day involvement is up to you and Solve.",
  },
  {
    title: "Quarterly distributions",
    body: "Once the market is producing profit, the intent is to pay partners a share of earnings on a quarterly basis, with the balance reinvested in growth.",
  },
  {
    title: "Built-in exit path",
    body: "The model targets a strategic sale of the market business in roughly five to seven years, on top of distributions already paid while it runs.",
  },
];

const OPERATING_MODEL = [
  {
    title: "Solve head office",
    body: "System design, permits, utility paperwork, project management, marketing, PR, and accounting, shared across every market we run.",
  },
  {
    title: "Your local market",
    body: "Roof surveys, install crews, materials, and field delivery, scaled as volume grows so cost does not run ahead of revenue.",
  },
];

const TEAM_BEHIND = [
  { role: "Chief Financial Officer", detail: "Reporting, controls, and the numbers every market is measured against." },
  { role: "VP of Operations", detail: "Delivery capacity, install quality, and operational standards." },
  { role: "Provincial sales leadership", detail: "Sales managers, training, and go-to-market in the province." },
  { role: "Head of Training", detail: "Installer training and certification." },
  { role: "Launch team", detail: "Stands each new market up and stays until it runs smoothly." },
];

const CALL_PREVIEW = [
  { step: "1", title: "The conversation", body: "The partnership model and whether it fits you, with no commitment on either side." },
  { step: "2", title: "The numbers", body: "We walk through projections for your market, line by line, with your questions." },
  { step: "3", title: "Term sheet", body: "If there is a fit, price, ownership, and key terms go in writing." },
  { step: "4", title: "Launch", body: "Your counsel reviews the agreement; then we open the market together." },
];

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
          You&apos;re one step away from speaking with our team. Watch the video, then lock in a time to
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
            Jump to calendar and book your investor partnership call
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
            <li>No obligation. Clarity on whether Solve is the right fit</li>
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

        <section className="thank-you-offer" aria-labelledby="thank-you-offer-heading">
          <p className="thank-you-offer-kicker">What you are partnering into</p>
          <h2 id="thank-you-offer-heading" className="thank-you-offer-title">
            Proven markets. One playbook. Real ownership.
          </h2>
          <p className="thank-you-offer-lead">
            Solve Energy is expanding city by city with{" "}
            <strong>one accredited partner per market</strong>. Victoria, Metro Vancouver, and the Okanagan
            already run on the same system your market would use. Calgary and other cities are next.
          </p>

          <ul className="thank-you-stats" role="list">
            {TRACK_RECORD.map((stat) => (
              <li key={stat.label} className="thank-you-stat">
                <span className="thank-you-stat-value">{stat.value}</span>
                <span className="thank-you-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>

          <ul className="thank-you-pillars" role="list">
            {PARTNERSHIP_HIGHLIGHTS.map((item) => (
              <li key={item.title} className="thank-you-pillar">
                <h3 className="thank-you-pillar-title">{item.title}</h3>
                <p className="thank-you-pillar-body">{item.body}</p>
              </li>
            ))}
          </ul>

          <div className="thank-you-split-model">
            <h3 className="thank-you-split-title">How each market runs</h3>
            <ul className="thank-you-split-list" role="list">
              {OPERATING_MODEL.map((item) => (
                <li key={item.title} className="thank-you-split-card">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="thank-you-split-tagline">
              Nothing is invented from scratch in a new city. It is documented, tested, and already running.
            </p>
          </div>

          <p className="thank-you-offer-disclaimer">
            Summary for discussion only. Not an offer to sell securities or investment advice. Returns,
            timing, and distributions are illustrative and not guaranteed; terms are set only in a signed
            agreement. Take your own legal, tax, and financial advice before committing capital.
          </p>
        </section>

        <section className="team-strip team-strip-featured" aria-labelledby="team-strip-heading">
          <p className="thank-you-offer-kicker">People-first partnership</p>
          <h2 id="team-strip-heading" className="team-strip-heading team-strip-heading-featured">
            Meet the team behind your market
          </h2>
          <p className="team-strip-lead">
            <strong>Kane Hammontree</strong>, Founder &amp; CEO, built Solve from the ground up, and the same
            leadership group that opened our running markets is who you will speak with on your investor
            partnership call.
          </p>

          <ul className="thank-you-team-roles" role="list">
            {TEAM_BEHIND.map((item) => (
              <li key={item.role} className="thank-you-team-role">
                <span className="thank-you-team-role-name">{item.role}</span>
                <span className="thank-you-team-role-detail">{item.detail}</span>
              </li>
            ))}
          </ul>

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

          <div className="thank-you-call-preview">
            <h3 className="thank-you-call-preview-title">What to expect after you book</h3>
            <ol className="thank-you-call-steps" role="list">
              {CALL_PREVIEW.map((item) => (
                <li key={item.step} className="thank-you-call-step">
                  <span className="thank-you-call-step-num" aria-hidden="true">
                    {item.step}
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="thank-you-cta-row thank-you-cta-row-end">
            <a href={`#${BOOKING_SECTION_ID}`} className="btn primary thank-you-scroll-cta" onClick={scrollToBooking}>
              Still need a time? Book your investor partnership call
            </a>
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

        <p className="fine-print">
          Solve Energy · Victoria · Langley · Kelowna ·{" "}
          <a href="tel:+18886676583">1-888-667-6583</a>
        </p>
      </div>
    </SurveyShell>
  );
}
