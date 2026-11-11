"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "solve-thank-you-exit-modal";

export default function BookingExitModal({ calendarUrl }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!calendarUrl) return;

    function onMouseLeave(e) {
      if (e.clientY > 0) return;
      openModal();
    }

    const onPopState = () => {
      openModal();
      history.pushState({ thankYouExitGuard: true }, "", window.location.href);
    };

    history.pushState({ thankYouExitGuard: true }, "", window.location.href);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
    };
  }, [calendarUrl, openModal]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open || !calendarUrl) return null;

  return (
    <div className="exit-modal-backdrop" onClick={() => setOpen(false)} role="presentation">
      <div
        className="exit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="exit-modal-close" onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
        <h2 id="exit-modal-title" className="exit-modal-title">
          Book your investor partnership call
        </h2>
        <p className="exit-modal-lead">
          Before you go, pick a time to speak with our team about your market.
        </p>
        <div className="exit-modal-calendar-wrap">
          <iframe
            title="Book an investor partnership call with Solve Energy"
            src={calendarUrl}
            className="exit-modal-calendar-iframe"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
