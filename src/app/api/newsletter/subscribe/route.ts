import { NextResponse } from "next/server";

import { assertAllowedOrigin } from "@/app/api/_utils/outbound-fetch";
import { BrevoApiError, createDoiContact } from "@/lib/brevo/client";
import { getBrevoNewsletterConfig } from "@/lib/env/newsletter";
import {
  parseSubscribeBody,
  SubscribeParseError,
  type SubscribeParseResult,
} from "@/lib/newsletter/parse-subscribe-body";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

const SUBSCRIBE_SUCCESS_MESSAGE =
  "Thanks for subscribing. Please check your email to confirm your subscription.";

function subscribeSuccessResponse() {
  return NextResponse.json(
    {
      ok: true,
      message: SUBSCRIBE_SUCCESS_MESSAGE,
    },
    { headers: NO_STORE_HEADERS, status: 200 }
  );
}

export async function POST(request: Request) {
  const originError = assertAllowedOrigin(request);
  if (originError) {
    return originError;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  let parseResult: SubscribeParseResult;
  try {
    parseResult = parseSubscribeBody(body);
  } catch (error) {
    if (error instanceof SubscribeParseError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { headers: NO_STORE_HEADERS, status: error.status }
      );
    }
    throw error;
  }

  if (parseResult.kind === "bot") {
    return subscribeSuccessResponse();
  }

  const parsed = parseResult.request;
  const brevoConfig = getBrevoNewsletterConfig();
  if (!brevoConfig.configured) {
    return NextResponse.json(
      {
        ok: false,
        error: "Newsletter signup is not configured yet",
      },
      { headers: NO_STORE_HEADERS, status: 503 }
    );
  }

  try {
    await createDoiContact({
      apiKey: brevoConfig.config.apiKey,
      email: parsed.email,
      listId: brevoConfig.config.websiteListId,
      templateId: brevoConfig.config.doiTemplateId,
      redirectUrl: brevoConfig.config.doiRedirectUrl,
      source: parsed.source,
    });
  } catch (error) {
    if (error instanceof BrevoApiError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { headers: NO_STORE_HEADERS, status: error.status }
      );
    }

    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { ok: false, error: "Subscription request timed out" },
        { headers: NO_STORE_HEADERS, status: 504 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unable to process subscription" },
      { headers: NO_STORE_HEADERS, status: 502 }
    );
  }

  return subscribeSuccessResponse();
}
