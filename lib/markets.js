/**
 * Markets for Solve Energy expansion survey.
 * Coordinates are approximate city centers (decimal degrees).
 * `value` keys must match leadSchema.marketInterest in leadPayload.js.
 */
export const MARKET_OPTIONS = [
  { value: "calgary_ab", label: "Calgary, AB", latLng: [51.0447, -114.0719] },
  { value: "edmonton_ab", label: "Edmonton, AB", latLng: [53.5461, -113.4938] },
  { value: "red_deer_ab", label: "Red Deer, AB", latLng: [52.2681, -113.8112] },
  { value: "lethbridge_ab", label: "Lethbridge, AB", latLng: [49.6942, -112.8328] },
  { value: "grande_prairie_ab", label: "Grande Prairie, AB", latLng: [55.1707, -118.7947] },
  { value: "saskatoon_sk", label: "Saskatoon, SK", latLng: [52.1332, -106.67] },
  { value: "regina_sk", label: "Regina, SK", latLng: [50.4452, -104.6189] },
  { value: "winnipeg_mb", label: "Winnipeg, MB", latLng: [49.8951, -97.1384] },
  { value: "toronto_on", label: "Toronto, ON", latLng: [43.6532, -79.3832] },
  { value: "ottawa_on", label: "Ottawa, ON", latLng: [45.4215, -75.6972] },
  { value: "kingston_on", label: "Kingston, ON", latLng: [44.2312, -76.486] },
  { value: "windsor_on", label: "Windsor, ON", latLng: [42.3149, -83.0364] },
  { value: "sudbury_on", label: "Sudbury, ON", latLng: [46.4922, -80.9936] },
  { value: "montreal_qc", label: "Montreal, QC", latLng: [45.5019, -73.5674] },
  { value: "quebec_city_qc", label: "Quebec City, QC", latLng: [46.8139, -71.208] },
  { value: "new_brunswick", label: "New Brunswick", latLng: [45.9636, -66.6431] },
  { value: "halifax_ns", label: "Halifax, NS", latLng: [44.6488, -63.5752] },
  { value: "st_johns_nl", label: "St. John's, NL", latLng: [47.5615, -52.7126] },
];

/**
 * Sold / not available for partnership (map-only). Not valid for form submission; pins show "Taken".
 */
export const TAKEN_MARKETS = [
  { value: "taken_victoria_bc", label: "Victoria, BC", latLng: [48.4284, -123.3656] },
  { value: "taken_vancouver_bc", label: "Vancouver, BC", latLng: [49.2827, -123.1207] },
  { value: "taken_kelowna_bc", label: "Kelowna, BC", latLng: [49.888, -119.496] },
  { value: "taken_cranbrook_bc", label: "Cranbrook, BC", latLng: [49.5123, -115.7687] },
  { value: "taken_prince_george_bc", label: "Prince George, BC", latLng: [53.9171, -122.7497] },
];
