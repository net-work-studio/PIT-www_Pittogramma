"use client";

import { useEffect, useRef, useState } from "react";

interface ProjectDescriptionProps {
  description: string | null;
}

export default function ProjectDescription({
  description,
}: ProjectDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [description]);

  if (!description) {
    return null;
  }

  return (
    <div>
      <p ref={textRef} className={expanded ? "" : "line-clamp-3"}>
        {description}
      </p>
      {(isClamped || expanded) && (
        <button
          className="cursor-pointer text-base underline"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
