import type { NewsletterSignupSource } from "@/lib/newsletter/types";

const BREVO_DOI_ENDPOINT =
  "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

export class BrevoApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BrevoApiError";
    this.status = status;
  }
}

export interface CreateDoiContactInput {
  apiKey: string;
  email: string;
  fetcher?: Fetcher;
  listId: number;
  redirectUrl: string;
  source: NewsletterSignupSource;
  templateId: number;
}

async function readBrevoErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string; code?: string };
    if (body.message) {
      return body.message;
    }
    if (body.code) {
      return body.code;
    }
  } catch {
    // Ignore JSON parse failures and fall back to generic messaging.
  }

  return "Unable to process subscription";
}

export async function createDoiContact(
  input: CreateDoiContactInput
): Promise<void> {
  const fetcher = input.fetcher ?? fetch;

  const response = await fetcher(BREVO_DOI_ENDPOINT, {
    body: JSON.stringify({
      attributes: {
        SIGNUP_CONTEXT: input.source,
        SIGNUP_SOURCE: "website",
      },
      email: input.email,
      includeListIds: [input.listId],
      redirectionUrl: input.redirectUrl,
      templateId: input.templateId,
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "api-key": input.apiKey,
      "Content-Type": "application/json",
    },
    method: "POST",
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 201 || response.status === 204) {
    return;
  }

  if (response.status === 400) {
    let message = "Invalid subscription request";
    try {
      const body = (await response.json()) as {
        message?: string;
        code?: string;
      };
      if (body.code === "duplicate_parameter") {
        throw new BrevoApiError("This email is already subscribed", 409);
      }
      if (body.message) {
        message = body.message;
      }
    } catch (error) {
      if (error instanceof BrevoApiError) {
        throw error;
      }
    }
    throw new BrevoApiError(message, 400);
  }

  if (response.status === 401) {
    throw new BrevoApiError(
      "Invalid Brevo API key. Check BREVO_API_KEY in your environment.",
      503
    );
  }

  if (response.status === 403) {
    const message = await readBrevoErrorMessage(response);
    throw new BrevoApiError(
      message === "Unable to process subscription"
        ? "Brevo rejected the request. Ensure the API key has Contacts permission."
        : message,
      503
    );
  }

  const message = await readBrevoErrorMessage(response);
  throw new BrevoApiError(message, 502);
}
