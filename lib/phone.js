/** Strip non-digits; keep up to 10 US national digits (drops leading country code 1). */
export function phoneDigitsOnly(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/** US display format: (555) 555-5555 */
export function formatPhoneDisplay(value) {
  const digits = phoneDigitsOnly(value);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isCompleteUsPhone(value) {
  return phoneDigitsOnly(value).length === 10;
}

export function toE164Us(value) {
  const digits = phoneDigitsOnly(value);
  if (digits.length !== 10) return null;
  return `+1${digits}`;
}
