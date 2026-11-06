const STORAGE_KEY = "solve_investor_lead";

/** @typedef {{ eventId: string, firstName: string, lastName: string, email: string, phone: string }} StoredLead */

/** @returns {StoredLead | null} */
export function getStoredLead() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.eventId || !data?.email) return null;
    return data;
  } catch {
    return null;
  }
}

/** @param {StoredLead} lead */
export function setStoredLead(lead) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
}

export function clearStoredLead() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
