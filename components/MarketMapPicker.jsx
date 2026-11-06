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
      <MarketMapLeaflet value={value} onChange={onChange} />
      {selectedLabel && (
        <p className="market-map-selection" role="status">
          Selected: <strong>{selectedLabel}</strong>
        </p>
      )}
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
