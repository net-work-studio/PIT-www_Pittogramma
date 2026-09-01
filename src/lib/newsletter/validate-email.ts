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
    return { email: normalized, error: "Email is required", valid: false };
  }

  if (normalized.length > MAX_EMAIL_LENGTH) {
    return { email: normalized, error: "Email is too long", valid: false };
  }

  if (!EMAIL_REGEX.test(normalized)) {
    return {
      email: normalized,
      error: "Invalid email address",
      valid: false,
    };
  }

  return { email: normalized, valid: true };
}
