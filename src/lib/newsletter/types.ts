export const NEWSLETTER_SIGNUP_SOURCES = [
  "footer",
  "newsletter_card",
] as const;

export type NewsletterSignupSource = (typeof NEWSLETTER_SIGNUP_SOURCES)[number];

export interface NewsletterSubscribeRequest {
  email: string;
  source: NewsletterSignupSource;
  website?: string;
}

export interface NewsletterSubscribeSuccess {
  message: string;
  ok: true;
}

export interface NewsletterSubscribeError {
  error: string;
  ok: false;
}

export type NewsletterSubscribeResponse =
  | NewsletterSubscribeSuccess
  | NewsletterSubscribeError;

export function isNewsletterSignupSource(
  value: unknown
): value is NewsletterSignupSource {
  return (
    typeof value === "string" &&
    (NEWSLETTER_SIGNUP_SOURCES as readonly string[]).includes(value)
  );
}
