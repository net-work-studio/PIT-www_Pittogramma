"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm tracking-widest text-muted-foreground">
        500
      </p>
      <h1 className="mt-4 text-2xl uppercase">Something went wrong</h1>
      <p className="mt-4 max-w-prose text-balance text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-10" onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
