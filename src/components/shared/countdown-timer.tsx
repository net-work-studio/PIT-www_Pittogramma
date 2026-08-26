"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  launchAt: string;
}

interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const emptyParts: CountdownParts = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

function getCountdownParts(launchAt: string): CountdownParts {
  const totalSeconds = Math.max(
    0,
    Math.floor((new Date(launchAt).getTime() - Date.now()) / 1000)
  );
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function CountdownTimer({ launchAt }: CountdownTimerProps) {
  const [parts, setParts] = useState(emptyParts);

  useEffect(() => {
    const update = () => setParts(getCountdownParts(launchAt));
    update();

    const interval = window.setInterval(update, 1000);
    const untilLaunch = new Date(launchAt).getTime() - Date.now();
    const reload = window.setTimeout(
      () => window.location.reload(),
      Math.max(0, untilLaunch) + 1000
    );

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(reload);
    };
  }, [launchAt]);

  return (
    <div
      aria-label="Countdown to launch"
      className="grid grid-cols-4 justify-center gap-6 sm:gap-8"
      role="timer"
    >
      <TimeUnit label="D" value={parts.days} />
      <TimeUnit label="H" value={parts.hours} />
      <TimeUnit label="M" value={parts.minutes} />
      <TimeUnit label="S" value={parts.seconds} />
    </div>
  );
}

function TimeUnit({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid justify-items-center gap-2">
      <span className="text-2xl tabular-nums leading-none">{value}</span>
      <span className="text-[#6f6b64] text-xs uppercase">{label}</span>
    </span>
  );
}
