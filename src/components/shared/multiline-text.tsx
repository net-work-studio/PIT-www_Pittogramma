import type { ReactNode } from "react";

const NEWLINE_PATTERN = /\r?\n/;

interface MultilineTextProps {
  text: string;
}

/** Renders editor-authored line breaks while leaving ordinary whitespace alone. */
export function MultilineText({ text }: MultilineTextProps) {
  const children: ReactNode[] = [];

  for (const line of text.split(NEWLINE_PATTERN)) {
    if (children.length > 0) {
      children.push(<br key={`line-break-${children.length}`} />);
    }
    children.push(line);
  }

  return children;
}
