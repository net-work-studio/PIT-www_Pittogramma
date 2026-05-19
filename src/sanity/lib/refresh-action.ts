"use client";

export async function refreshAction(): Promise<"refresh"> {
  await Promise.resolve();
  return "refresh";
}
