import type { PublicSiteState } from "@/lib/public-site-state";

import { CountdownTimer } from "./countdown-timer";

type HoldingPageState = Exclude<PublicSiteState, { mode: "live" }>;

export function PublicHoldingPage({ state }: { state: HoldingPageState }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-6 py-12 text-[#111] sm:px-12">
      <section
        aria-labelledby="public-site-heading"
        className="grid w-full max-w-4xl justify-items-center text-center"
      >
        <PittogrammaMark />
        <h1
          className="mt-12 text-[clamp(1.75rem,8vw,2.5rem)] leading-[1.1]"
          id="public-site-heading"
        >
          {state.heading}
        </h1>
        {state.message ? (
          <p className="mt-5 max-w-xl whitespace-pre-wrap text-[#6f6b64] text-base leading-relaxed">
            {state.message}
          </p>
        ) : null}
        {state.mode === "countdown" ? (
          <Countdown state={state} />
        ) : (
          <Maintenance state={state} />
        )}
      </section>
    </main>
  );
}

function Countdown({
  state,
}: {
  state: Extract<PublicSiteState, { mode: "countdown" }>;
}) {
  return (
    <>
      <div className="mt-12">
        <CountdownTimer launchAt={state.launchAt} />
      </div>
      <p className="mt-7 text-[#6f6b64] text-sm">
        Launching {formatDateTime(state.launchAt)}.
      </p>
    </>
  );
}

function Maintenance({
  state,
}: {
  state: Extract<PublicSiteState, { mode: "maintenance" }>;
}) {
  return (
    <div className="mt-8 grid justify-items-center gap-4 text-[#6f6b64] text-sm">
      {state.returnAt ? (
        <p>Expected back {formatDateTime(state.returnAt)}.</p>
      ) : null}
      {state.contactUrl ? (
        <a
          className="text-[#111] underline underline-offset-4"
          href={state.contactUrl}
        >
          Contact Pittogramma
        </a>
      ) : null}
    </div>
  );
}

function PittogrammaMark() {
  return (
    <svg
      aria-label="Pittogramma"
      fill="none"
      height="34"
      role="img"
      viewBox="0 0 15 17"
      width="30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.938 1.895H5.1V7.56h3.84zM14.692 17h-1.915V1.895h-1.924V17H8.938V9.439H5.1q-1.977 0-3.389-1.39-1.402-1.4-1.402-3.32 0-1.95 1.411-3.339Q3.14 0 5.1 0h9.593z"
        fill="currentColor"
      />
    </svg>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: "Europe/Rome",
    timeZoneName: "short",
    year: "numeric",
  }).format(new Date(value));
}
