import { afterEach, describe, expect, mock, test } from "bun:test";

import { BrevoApiError, createDoiContact } from "@/lib/brevo/client";
import { getBrevoNewsletterConfig } from "@/lib/env/newsletter";
import {
  isHoneypotTriggered,
  parseSubscribeBody,
} from "@/lib/newsletter/parse-subscribe-body";
import { validateEmail } from "@/lib/newsletter/validate-email";
import { POST } from "./route";

const originalEnv = {
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_WEBSITE_LIST_ID: process.env.BREVO_WEBSITE_LIST_ID,
  BREVO_DOI_TEMPLATE_ID: process.env.BREVO_DOI_TEMPLATE_ID,
  BREVO_DOI_REDIRECT_URL: process.env.BREVO_DOI_REDIRECT_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
};

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function setConfiguredBrevoEnv() {
  process.env.BREVO_API_KEY = "test-api-key";
  process.env.BREVO_WEBSITE_LIST_ID = "12";
  process.env.BREVO_DOI_TEMPLATE_ID = "34";
  process.env.BREVO_DOI_REDIRECT_URL = "https://pittogramma.xyz/journal";
  process.env.NEXT_PUBLIC_BASE_URL = "https://pittogramma.xyz";
}

function createSubscribeRequest(
  body: unknown,
  origin = "https://pittogramma.xyz"
) {
  return new Request("https://pittogramma.xyz/api/newsletter/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify(body),
  });
}

describe("validateEmail", () => {
  test("normalizes and accepts valid email", () => {
    const result = validateEmail("  Test@Example.com ");
    expect(result.valid).toBe(true);
    expect(result.email).toBe("test@example.com");
  });

  test("rejects invalid email", () => {
    const result = validateEmail("not-an-email");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email address");
  });
});

describe("parseSubscribeBody", () => {
  test("parses valid body", () => {
    const parsed = parseSubscribeBody({
      email: "reader@example.com",
      source: "footer",
    });

    expect(parsed.kind).toBe("valid");
    if (parsed.kind === "valid") {
      expect(parsed.request.email).toBe("reader@example.com");
      expect(parsed.request.source).toBe("footer");
    }
  });

  test("rejects invalid source", () => {
    expect(() =>
      parseSubscribeBody({
        email: "reader@example.com",
        source: "sidebar",
      })
    ).toThrow("Invalid signup source");
  });

  test("returns bot outcome for honeypot field", () => {
    expect(
      parseSubscribeBody({
        email: "reader@example.com",
        source: "footer",
        website: "https://spam.example",
      })
    ).toEqual({ kind: "bot" });
  });

  test("detects honeypot field", () => {
    expect(isHoneypotTriggered("bot")).toBe(true);
    expect(isHoneypotTriggered("")).toBe(false);
  });
});

describe("getBrevoNewsletterConfig", () => {
  test("reports missing env vars", () => {
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_WEBSITE_LIST_ID;
    delete process.env.BREVO_DOI_TEMPLATE_ID;
    delete process.env.BREVO_DOI_REDIRECT_URL;

    const result = getBrevoNewsletterConfig();
    expect(result.configured).toBe(false);
    if (!result.configured) {
      expect(result.missing).toContain("BREVO_API_KEY");
    }
  });

  test("returns config when env vars are valid", () => {
    setConfiguredBrevoEnv();
    const result = getBrevoNewsletterConfig();
    expect(result.configured).toBe(true);
    if (result.configured) {
      expect(result.config.websiteListId).toBe(12);
      expect(result.config.doiTemplateId).toBe(34);
    }
  });
});

describe("createDoiContact", () => {
  test("sends DOI payload to Brevo", async () => {
    const fetcher = mock(async () => new Response(null, { status: 201 }));

    await createDoiContact({
      apiKey: "test-api-key",
      email: "reader@example.com",
      listId: 12,
      templateId: 34,
      redirectUrl: "https://pittogramma.xyz/journal",
      source: "footer",
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation"
    );
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["api-key"]).toBe(
      "test-api-key"
    );

    const payload = JSON.parse(String(init.body)) as {
      email: string;
      includeListIds: number[];
      attributes: Record<string, string>;
    };
    expect(payload.email).toBe("reader@example.com");
    expect(payload.includeListIds).toEqual([12]);
    expect(payload.attributes.SIGNUP_SOURCE).toBe("website");
    expect(payload.attributes.SIGNUP_CONTEXT).toBe("footer");
  });

  test("maps duplicate contact to 409", async () => {
    const fetcher = mock(
      async () =>
        new Response(
          JSON.stringify({
            code: "duplicate_parameter",
            message: "Contact already exist",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        )
    );

    await expect(
      createDoiContact({
        apiKey: "test-api-key",
        email: "reader@example.com",
        listId: 12,
        templateId: 34,
        redirectUrl: "https://pittogramma.xyz/journal",
        source: "footer",
        fetcher,
      })
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("POST /api/newsletter/subscribe", () => {
  test("rejects forbidden origin", async () => {
    const response = await POST(
      createSubscribeRequest(
        { email: "reader@example.com", source: "footer" },
        "https://evil.example"
      )
    );

    expect(response.status).toBe(403);
  });

  test("rejects invalid JSON", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://pittogramma.xyz";

    const response = await POST(
      new Request("https://pittogramma.xyz/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://pittogramma.xyz",
        },
        body: "{",
      })
    );

    expect(response.status).toBe(400);
  });

  test("returns success for honeypot submissions without calling Brevo", async () => {
    setConfiguredBrevoEnv();

    const response = await POST(
      createSubscribeRequest({
        email: "reader@example.com",
        source: "footer",
        website: "https://spam.example",
      })
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });

  test("returns 503 when Brevo is not configured", async () => {
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_WEBSITE_LIST_ID;
    delete process.env.BREVO_DOI_TEMPLATE_ID;
    delete process.env.BREVO_DOI_REDIRECT_URL;
    process.env.NEXT_PUBLIC_BASE_URL = "https://pittogramma.xyz";

    const response = await POST(
      createSubscribeRequest({
        email: "reader@example.com",
        source: "footer",
      })
    );

    expect(response.status).toBe(503);
  });

  test("returns success when Brevo accepts subscription", async () => {
    setConfiguredBrevoEnv();

    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async () => new Response(null, { status: 201 }));

    try {
      const response = await POST(
        createSubscribeRequest({
          email: "reader@example.com",
          source: "journal_article",
        })
      );

      expect(response.status).toBe(200);
      const body = (await response.json()) as { ok: boolean; message: string };
      expect(body.ok).toBe(true);
      expect(body.message).toContain("check your email");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("maps duplicate subscription to 409", async () => {
    setConfiguredBrevoEnv();

    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(
      async () =>
        new Response(
          JSON.stringify({
            code: "duplicate_parameter",
            message: "Contact already exist",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
    );

    try {
      const response = await POST(
        createSubscribeRequest({
          email: "reader@example.com",
          source: "newsletter_card",
        })
      );

      expect(response.status).toBe(409);
      const body = (await response.json()) as { error: string };
      expect(body.error).toBe("This email is already subscribed");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("maps upstream failure to 502", async () => {
    setConfiguredBrevoEnv();

    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async () => new Response(null, { status: 500 }));

    try {
      const response = await POST(
        createSubscribeRequest({
          email: "reader@example.com",
          source: "footer",
        })
      );

      expect(response.status).toBe(502);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe("BrevoApiError", () => {
  test("carries status code", () => {
    const error = new BrevoApiError("failed", 502);
    expect(error.status).toBe(502);
  });
});
