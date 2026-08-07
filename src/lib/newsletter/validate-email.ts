const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export interface EmailValidationResult {
  email: string;
  error?: string;
  valid: boolean;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): EmailValidationResult {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return { email: normalized, valid: false, error: "Email is required" };
  }

  if (normalized.length > MAX_EMAIL_LENGTH) {
    return { email: normalized, valid: false, error: "Email is too long" };
  }

  if (!EMAIL_REGEX.test(normalized)) {
    return {
      email: normalized,
      valid: false,
      error: "Invalid email address",
    };
  }

  return { email: normalized, valid: true };
}
