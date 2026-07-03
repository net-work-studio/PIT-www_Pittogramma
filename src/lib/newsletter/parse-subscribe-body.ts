import {
  isNewsletterSignupSource,
  type NewsletterSubscribeRequest,
} from "@/lib/newsletter/types";
import { validateEmail } from "@/lib/newsletter/validate-email";

const MAX_BODY_FIELD_LENGTH = 254;

export class SubscribeParseError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "SubscribeParseError";
    this.status = status;
  }
}

export function isHoneypotTriggered(website: unknown): boolean {
  return typeof website === "string" && website.trim() !== "";
}

export type SubscribeParseResult =
  | { kind: "bot" }
  | { kind: "valid"; request: NewsletterSubscribeRequest };

export function parseSubscribeBody(body: unknown): SubscribeParseResult {
  if (!body || typeof body !== "object") {
    throw new SubscribeParseError("Invalid JSON body");
  }

  const record = body as Record<string, unknown>;
  const email = record.email;
  const source = record.source;
  const website = record.website;

  if (typeof email !== "string") {
    throw new SubscribeParseError("Email is required");
  }

  if (!isNewsletterSignupSource(source)) {
    throw new SubscribeParseError("Invalid signup source");
  }

  if (typeof website === "string" && website.length > MAX_BODY_FIELD_LENGTH) {
    throw new SubscribeParseError("Invalid subscription request");
  }

  if (isHoneypotTriggered(website)) {
    return { kind: "bot" };
  }

  const emailResult = validateEmail(email);
  if (!emailResult.valid) {
    throw new SubscribeParseError(emailResult.error ?? "Invalid email address");
  }

  return {
    kind: "valid",
    request: {
      email: emailResult.email,
      source,
      website: typeof website === "string" ? website : undefined,
    },
  };
}
