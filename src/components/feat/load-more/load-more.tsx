"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface LoadMoreProps {
  currentPage: number;
  totalPages: number;
}

function LoadMoreLabel() {
  const { pending } = useLinkStatus();
  return <>{pending ? "Loading…" : "Load more"}</>;
}

export default function LoadMore({ currentPage, totalPages }: LoadMoreProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (currentPage >= totalPages) return null;

  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(currentPage + 1));
  const href = `${pathname}?${params.toString()}`;

  return (
    <div className="flex items-center justify-center">
      <Button asChild className="rounded-full font-mono uppercase">
        <Link href={href} scroll={false}>
          <LoadMoreLabel />
        </Link>
      </Button>
    </div>
  );
}
