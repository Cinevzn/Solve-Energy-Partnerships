/** Session key: contact from step 1 for step 3 questionnaire (same browser tab/session). */
export const LEAD_SESSION_KEY = "solve_lead_session_v1";

/** @typedef {{ eventId: string; firstName: string; lastName: string; email: string; phoneDigits: string }} LeadSession */

/**
 * @returns {LeadSession | null}
 */
export function readLeadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LEAD_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (
      data &&
      typeof data.eventId === "string" &&
      typeof data.firstName === "string" &&
      typeof data.lastName === "string" &&
      typeof data.email === "string" &&
      typeof data.phoneDigits === "string" &&
      data.phoneDigits.length === 10
    ) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/** @param {LeadSession} session */
export function writeLeadSession(session) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LEAD_SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore quota */
  }
}
