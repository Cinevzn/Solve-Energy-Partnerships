"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MARKET_OPTIONS, TAKEN_MARKETS } from "@/lib/markets";

const ALL_MAP_POINTS = [...MARKET_OPTIONS, ...TAKEN_MARKETS];

const SOLVE_ICON_SRC = "/branding/solve-icon.svg";

function takenPinHtml() {
  return `<div class="market-map-pin-taken-svg" role="presentation"><img src="${SOLVE_ICON_SRC}" alt="" width="20" height="20" decoding="async" /></div>`;
}

function FitBounds() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(ALL_MAP_POINTS.map((m) => m.latLng));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
  }, [map]);

  return null;
}

export default function MarketMapLeaflet({ value, onChange }) {
  const selectedIcon = useMemo(
    () =>
      L.divIcon({
        className: "market-map-pin market-map-pin-selected",
        html:
          '<span class="market-map-pin-ring"></span><span class="market-map-pin-dot market-map-pin-dot-selected"></span>',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        tooltipAnchor: [0, -40],
      }),
    [],
  );

  const defaultIcon = useMemo(
    () =>
      L.divIcon({
        className: "market-map-pin",
        html: '<span class="market-map-pin-dot"></span>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        tooltipAnchor: [0, -28],
      }),
    [],
  );

  const takenIcon = useMemo(
    () =>
      L.divIcon({
        className: "market-map-pin market-map-pin-taken-leaflet",
        html: takenPinHtml(),
        iconSize: [26, 26],
        iconAnchor: [13, 26],
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
      style={{ width: "100%" }}
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
      {TAKEN_MARKETS.map((m) => (
        <Marker key={m.value} position={m.latLng} icon={takenIcon}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            {m.label} (taken)
          </Tooltip>
          <Popup>
            <strong>Taken</strong>
            <br />
            {m.label} is not available.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
