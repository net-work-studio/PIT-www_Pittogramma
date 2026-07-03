"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  NewsletterSignupSource,
  NewsletterSubscribeResponse,
} from "@/lib/newsletter/types";
import { cn } from "@/lib/utils";

interface NewsletterSignupFormProps {
  buttonText?: string;
  className?: string;
  compact?: boolean;
  source: NewsletterSignupSource;
}

export default function NewsletterSignupForm({
  source,
  className,
  buttonText = "Subscribe",
  compact = false,
}: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  function clearFeedback() {
    if (status === "error") {
      setStatus("idle");
      setMessage(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          website,
        }),
      });

      const body = (await response.json()) as NewsletterSubscribeResponse;

      if (!(response.ok && body.ok)) {
        setStatus("error");
        setMessage(
          body.ok === false
            ? body.error
            : "Unable to process subscription. Please try again."
        );
        return;
      }

      setStatus("success");
      setMessage(body.message);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Unable to process subscription. Please try again.");
    }
  }

  return (
    <form className={cn(className)} noValidate onSubmit={handleSubmit}>
      <div
        aria-hidden="true"
        className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`newsletter-website-${source}`}>Website</label>
        <input
          autoComplete="off"
          id={`newsletter-website-${source}`}
          name="website"
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          type="text"
          value={website}
        />
      </div>

      <div
        className={cn(
          "flex gap-2",
          compact ? "flex-col sm:flex-row sm:items-end" : "flex-col sm:flex-row"
        )}
      >
        <Input
          aria-describedby={message ? `newsletter-status-${source}` : undefined}
          aria-invalid={status === "error"}
          autoComplete="email"
          className="min-w-0 flex-1"
          disabled={status === "loading" || status === "success"}
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            clearFeedback();
          }}
          onFocus={clearFeedback}
          placeholder="Email address"
          required
          type="email"
          value={email}
        />
        <Button
          className={cn(compact ? "w-full sm:w-auto" : "w-full sm:w-auto")}
          disabled={status === "loading" || status === "success"}
          size="sm"
          type="submit"
          variant="outline"
        >
          {status === "loading" ? "Subscribing..." : buttonText}
        </Button>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className={cn(
            "mt-2 text-sm",
            status === "error" && "text-destructive",
            status === "success" && "text-muted-foreground"
          )}
          id={`newsletter-status-${source}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
