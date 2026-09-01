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
      message: SUBSCRIBE_SUCCESS_MESSAGE,
      ok: true,
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
      { error: "Invalid JSON body", ok: false },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  let parseResult: SubscribeParseResult;
  try {
    parseResult = parseSubscribeBody(body);
  } catch (error) {
    if (error instanceof SubscribeParseError) {
      return NextResponse.json(
        { error: error.message, ok: false },
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
        error: "Newsletter signup is not configured yet",
        ok: false,
      },
      { headers: NO_STORE_HEADERS, status: 503 }
    );
  }

  try {
    await createDoiContact({
      apiKey: brevoConfig.config.apiKey,
      email: parsed.email,
      listId: brevoConfig.config.websiteListId,
      redirectUrl: brevoConfig.config.doiRedirectUrl,
      source: parsed.source,
      templateId: brevoConfig.config.doiTemplateId,
    });
  } catch (error) {
    if (error instanceof BrevoApiError) {
      return NextResponse.json(
        { error: error.message, ok: false },
        { headers: NO_STORE_HEADERS, status: error.status }
      );
    }

    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Subscription request timed out", ok: false },
        { headers: NO_STORE_HEADERS, status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Unable to process subscription", ok: false },
      { headers: NO_STORE_HEADERS, status: 502 }
    );
  }

  return subscribeSuccessResponse();
}
