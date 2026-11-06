"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MARKET_OPTIONS } from "@/lib/markets";

function FitBounds() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(MARKET_OPTIONS.map((m) => m.latLng));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
  }, [map]);

  return null;
}

export default function MarketMapLeaflet({ value, onChange }) {
  const selectedIcon = useMemo(
    () =>
      L.divIcon({
        className: "market-map-pin market-map-pin-selected",
        html: '<span class="market-map-pin-dot"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        tooltipAnchor: [0, -26],
      }),
    [],
  );

  const defaultIcon = useMemo(
    () =>
      L.divIcon({
        className: "market-map-pin",
        html: '<span class="market-map-pin-dot"></span>',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        tooltipAnchor: [0, -22],
      }),
    [],
  );

  return (
    <MapContainer
      className="market-map-container"
      center={[56, -96]}
      zoom={4}
      scrollWheelZoom
      style={{ height: "min(52vh, 420px)", width: "100%", borderRadius: "var(--radius)" }}
    >
      <FitBounds />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {MARKET_OPTIONS.map((m) => (
        <Marker
          key={m.value}
          position={m.latLng}
          icon={value === m.value ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => onChange(m.value),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            {m.label}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
