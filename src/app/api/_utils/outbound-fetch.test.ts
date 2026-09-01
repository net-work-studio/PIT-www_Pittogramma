import { afterEach, describe, expect, test } from "bun:test";
import {
  assertAllowedOrigin,
  assertSanityProjectUser,
  buildBinaryResponse,
  fetchWithSafeRedirects,
  isAllowedHtmlContentType,
  isAllowedImageContentType,
  readJsonStringField,
  readLimitedText,
  validatePublicHttpUrl,
} from "./outbound-fetch";

const PUBLIC_TEST_URL = new URL("https://93.184.216.34/start");
const GOOGLE_BOOKS_HOSTNAMES = [
  "books.google.com",
  "books.google.it",
  "books.googleapis.com",
];

const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const originalNodeEnv = process.env.NODE_ENV;
const originalSanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const originalVercelUrl = process.env.VERCEL_URL;

function setOptionalEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

afterEach(() => {
  setOptionalEnv("NEXT_PUBLIC_BASE_URL", originalBaseUrl);
  setOptionalEnv("NODE_ENV", originalNodeEnv);
  setOptionalEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", originalSanityProjectId);
  setOptionalEnv("VERCEL_URL", originalVercelUrl);
});

describe("validatePublicHttpUrl", () => {
  test.each([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.0.1",
    "169.254.169.254",
  ])("rejects blocked host %s", async (hostname) => {
    await expect(
      validatePublicHttpUrl(`https://${hostname}/`)
    ).rejects.toMatchObject({
      status: 400,
    });
  });

  test("rejects URL credentials", async () => {
    await expect(
      validatePublicHttpUrl("https://user:pass@93.184.216.34/")
    ).rejects.toMatchObject({ status: 400 });
  });

  test("rejects non-HTTP protocols", async () => {
    await expect(
      validatePublicHttpUrl("file:///etc/passwd")
    ).rejects.toMatchObject({
      status: 400,
    });
  });

  test("Google Books image configuration rejects non-Google hostnames", async () => {
    await expect(
      validatePublicHttpUrl("https://93.184.216.34/cover.jpg", {
        allowedHostnames: GOOGLE_BOOKS_HOSTNAMES,
        httpsOnly: true,
      })
    ).rejects.toMatchObject({ status: 400 });
  });
});

describe("assertAllowedOrigin", () => {
  test("rejects missing Origin", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://pittogramma.com";
    setOptionalEnv("NODE_ENV", "production");
    delete process.env.VERCEL_URL;

    const response = assertAllowedOrigin(
      new Request("https://pittogramma.com/api/test", { method: "POST" })
    );

    expect(response?.status).toBe(403);
  });

  test("rejects invalid Origin", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://pittogramma.com";
    setOptionalEnv("NODE_ENV", "production");
    delete process.env.VERCEL_URL;

    const response = assertAllowedOrigin(
      new Request("https://pittogramma.com/api/test", {
        headers: { Origin: "https://attacker.example" },
        method: "POST",
      })
    );

    expect(response?.status).toBe(403);
  });

  test("allows configured site origin", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://pittogramma.com";
    setOptionalEnv("NODE_ENV", "production");
    delete process.env.VERCEL_URL;

    const response = assertAllowedOrigin(
      new Request("https://pittogramma.com/api/test", {
        headers: { Origin: "https://pittogramma.com" },
        method: "POST",
      })
    );

    expect(response).toBeNull();
  });
});

describe("assertSanityProjectUser", () => {
  test("rejects missing Authorization", async () => {
    const response = await assertSanityProjectUser(
      new Request("https://pittogramma.com/api/test", { method: "POST" }),
      {
        fetcher: (() => {
          throw new Error("fetcher should not be called");
        }) as unknown as typeof fetch,
        projectId: "project-id",
      }
    );

    expect(response?.status).toBe(401);
  });

  test("rejects malformed Authorization", async () => {
    const response = await assertSanityProjectUser(
      new Request("https://pittogramma.com/api/test", {
        headers: { Authorization: "Token abc" },
        method: "POST",
      }),
      {
        fetcher: (() => {
          throw new Error("fetcher should not be called");
        }) as unknown as typeof fetch,
        projectId: "project-id",
      }
    );

    expect(response?.status).toBe(401);
  });

  test("rejects non-OK Sanity verification", async () => {
    const response = await assertSanityProjectUser(
      new Request("https://pittogramma.com/api/test", {
        headers: { Authorization: "Bearer non-ok-token" },
        method: "POST",
      }),
      {
        fetcher: (() =>
          Promise.resolve(
            new Response("Nope", { status: 403 })
          )) as unknown as typeof fetch,
        projectId: "project-id",
      }
    );

    expect(response?.status).toBe(403);
  });

  test("allows OK Sanity verification", async () => {
    let verificationUrl: string | undefined;
    let verificationAuthorization: string | null = null;

    const response = await assertSanityProjectUser(
      new Request("https://pittogramma.com/api/test", {
        headers: { Authorization: "Bearer ok-token" },
        method: "POST",
      }),
      {
        fetcher: ((
          input: Parameters<typeof fetch>[0],
          init: Parameters<typeof fetch>[1]
        ) => {
          verificationUrl = input.toString();
          verificationAuthorization =
            init?.headers instanceof Headers
              ? init.headers.get("authorization")
              : ((init?.headers as Record<string, string> | undefined)
                  ?.Authorization ?? null);

          return Promise.resolve(new Response("{}", { status: 200 }));
        }) as unknown as typeof fetch,
        projectId: "project-id",
      }
    );

    expect(response).toBeNull();
    expect(verificationUrl).toBe(
      "https://project-id.api.sanity.io/v2021-06-07/users/me"
    );
    expect(verificationAuthorization).toBe("Bearer ok-token");
  });

  test("does not log or expose the token", async () => {
    const token = "secret-token-that-must-not-leak";
    const logs: string[] = [];
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;

    console.error = (...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    };
    console.log = (...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    };

    try {
      const response = await assertSanityProjectUser(
        new Request("https://pittogramma.com/api/test", {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
        }),
        {
          fetcher: (() =>
            Promise.resolve(
              new Response("Unauthorized", { status: 401 })
            )) as unknown as typeof fetch,
          projectId: "project-id",
        }
      );
      const body = await response?.json();

      expect(response?.status).toBe(401);
      expect(JSON.stringify(body).includes(token)).toBe(false);
      expect(logs.join("\n").includes(token)).toBe(false);
    } finally {
      console.error = originalConsoleError;
      console.log = originalConsoleLog;
    }
  });
});

describe("readJsonStringField", () => {
  test("reads a valid string field", async () => {
    const request = new Request("https://pittogramma.com/api/test", {
      body: JSON.stringify({ isbn: "9781234567890" }),
      method: "POST",
    });

    const value = await readJsonStringField(request, "isbn");
    expect(value).toBe("9781234567890");
  });

  test("rejects invalid JSON", async () => {
    const request = new Request("https://pittogramma.com/api/test", {
      body: "{",
      method: "POST",
    });

    await expect(readJsonStringField(request, "isbn")).rejects.toMatchObject({
      status: 400,
    });
  });

  test.each<[string, Record<string, unknown>]>([
    ["missing field", {}],
    ["non-string field", { isbn: 123 }],
    ["empty string", { isbn: " " }],
  ])("rejects %s", async (_label, body) => {
    const request = new Request("https://pittogramma.com/api/test", {
      body: JSON.stringify(body),
      method: "POST",
    });

    await expect(readJsonStringField(request, "isbn")).rejects.toMatchObject({
      status: 400,
    });
  });

  test("rejects overlong strings", async () => {
    const request = new Request("https://pittogramma.com/api/test", {
      body: JSON.stringify({ query: "abc" }),
      method: "POST",
    });

    await expect(
      readJsonStringField(request, "query", { maxLength: 2 })
    ).rejects.toMatchObject({ status: 400 });
  });
});

describe("fetchWithSafeRedirects", () => {
  test("rejects redirects to private hosts", async () => {
    await expect(
      fetchWithSafeRedirects(
        PUBLIC_TEST_URL,
        {},
        {
          fetcher: (() =>
            Promise.resolve(
              Response.redirect("http://127.0.0.1/private", 302)
            )) as unknown as typeof fetch,
          maxRedirects: 3,
        }
      )
    ).rejects.toMatchObject({ status: 400 });
  });

  test("stops after 3 redirects", async () => {
    let calls = 0;

    await expect(
      fetchWithSafeRedirects(
        PUBLIC_TEST_URL,
        {},
        {
          fetcher: (() => {
            calls += 1;
            const redirectUrl = new URL(`/redirect-${calls}`, PUBLIC_TEST_URL);
            return Promise.resolve(Response.redirect(redirectUrl, 302));
          }) as unknown as typeof fetch,
          maxRedirects: 3,
        }
      )
    ).rejects.toMatchObject({ status: 400 });

    expect(calls).toBe(4);
  });
});

describe("bounded response readers", () => {
  test("rejects oversized text streams", async () => {
    await expect(
      readLimitedText(new Response("abcdef"), 3)
    ).rejects.toMatchObject({
      status: 413,
    });
  });

  test("rejects oversized image streams", async () => {
    await expect(
      buildBinaryResponse(
        new Response(new Uint8Array([1, 2, 3, 4]), {
          headers: { "Content-Type": "image/png" },
        }),
        3
      )
    ).rejects.toMatchObject({ status: 413 });
  });
});

describe("image content types", () => {
  test.each([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ])("allows %s", (contentType) => {
    expect(isAllowedImageContentType(contentType)).toBe(true);
  });

  test("rejects SVG", () => {
    expect(isAllowedImageContentType("image/svg+xml")).toBe(false);
  });
});

describe("HTML content types", () => {
  test.each(["text/html", "Text/HTML; charset=UTF-8", "APPLICATION/XHTML+XML"])(
    "allows %s",
    (contentType) => {
      expect(isAllowedHtmlContentType(contentType)).toBe(true);
    }
  );

  test("rejects non-HTML content", () => {
    expect(isAllowedHtmlContentType("application/json")).toBe(false);
  });
});
