"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <header className="fixed top-0 right-0 left-0 z-20 flex w-full items-center border-foreground/10 border-b bg-background px-4 py-2.5">
          <Link className="flex items-center" href="/">
            <span className="sr-only">Pittogramma — Home</span>
            <svg
              aria-hidden="true"
              fill="none"
              height={17}
              viewBox="0 0 15 17"
              width={15}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-black dark:fill-white"
                d="M8.938 1.895H5.1V7.56h3.84zM14.692 17h-1.915V1.895h-1.924V17H8.938V9.439H5.1q-1.977 0-3.389-1.39-1.402-1.4-1.402-3.32 0-1.95 1.411-3.339Q3.14 0 5.1 0h9.593z"
              />
            </svg>
          </Link>
        </header>

        <main className="mt-14 mb-auto flex flex-1 flex-col items-center justify-center px-5 text-center">
          <p className="font-mono text-muted-foreground text-sm tracking-widest">
            Error
          </p>
          <h1 className="mt-4 text-2xl uppercase">Something went wrong</h1>
          <p className="mt-4 max-w-prose text-balance text-muted-foreground">
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            className="mt-10 inline-flex h-9 items-center justify-center rounded-full border px-4 py-2 font-medium text-sm shadow-xs transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        </main>

        <footer className="p-4">
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-secondary p-4">
            <ul>
              <li>Pittogramma</li>
              <li>
                <p>© {new Date().getFullYear()}. All Rights Reserved</p>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}
