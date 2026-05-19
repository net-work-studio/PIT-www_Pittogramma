"use client";

import { useEffect, useState } from "react";
import { useSource } from "sanity";

export function useSanityAuthToken(): string | null | undefined {
  const source = useSource();
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const tokenSource = source.auth.token;
    if (!tokenSource) {
      setToken(null);
      return;
    }

    const subscription = tokenSource.subscribe((nextToken) => {
      setToken(nextToken);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [source.auth.token]);

  return token;
}

export function getStudioApiHeaders(
  token: string | null | undefined
): HeadersInit {
  if (!token) {
    throw new Error(
      "Sanity authentication is not ready. Please refresh and sign in again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
