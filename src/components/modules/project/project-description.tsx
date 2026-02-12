"use client";

import { useState } from "react";

interface ProjectDescriptionProps {
  description: string | null;
}

export default function ProjectDescription({
  description,
}: ProjectDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    return null;
  }

  return (
    <div>
      <p className={expanded ? "" : "line-clamp-3"}>{description}</p>
      <button
        className="cursor-pointer text-base underline"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
