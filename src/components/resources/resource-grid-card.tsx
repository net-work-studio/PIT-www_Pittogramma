import type { ReactNode } from "react";

interface ResourceGridCardProps {
  children: ReactNode;
  href?: string;
}

export function ResourceGridCard({ children, href }: ResourceGridCardProps) {
  if (!href) {
    return children;
  }

  return (
    <a
      className="no-underline"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
