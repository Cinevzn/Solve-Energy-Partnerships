"use client";

import dynamic from "next/dynamic";
import { MARKET_OPTIONS } from "@/lib/markets";

const MarketMapLeaflet = dynamic(() => import("./MarketMapLeaflet"), {
  ssr: false,
  loading: () => <div className="market-map-skeleton">Loading map…</div>,
});

function labelForValue(value) {
  if (value === "other_city") return "My city is not listed";
  return MARKET_OPTIONS.find((m) => m.value === value)?.label ?? "";
}

export default function MarketMapPicker({ value, onChange }) {
  const selectedLabel = value ? labelForValue(value) : "";

  return (
    <div className="market-map-wrap">
      <div className={`market-map-selection-banner ${value ? "has-selection" : ""}`} role="status">
        {value ? (
          <>
            <span className="market-map-selection-check" aria-hidden="true">
              ✓
            </span>
            <span className="market-map-selection-text">
              <strong>{selectedLabel}</strong>
              <span className="market-map-selection-hint">
                Tap another pin to change, then Continue
              </span>
            </span>
          </>
        ) : (
          <span className="market-map-selection-placeholder">
            Tap a <strong>green pin</strong> on the map to choose your market
          </span>
        )}
      </div>
      <MarketMapLeaflet value={value} onChange={onChange} />
      <button
        type="button"
        className={`choice-btn choice-btn-full choice-muted ${value === "other_city" ? "selected" : ""}`}
        onClick={() => onChange("other_city")}
      >
        My city is not listed
      </button>
    </div>
  );
}
