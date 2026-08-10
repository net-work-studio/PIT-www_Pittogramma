"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import {
  getResourceTargetElementId,
  RESOURCE_TARGET_SEARCH_PARAM,
} from "@/lib/resource-target";

export function useResourceTarget(resourceIds: string[]) {
  const [targetResourceId, setTargetResourceId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const requestedResourceId = searchParams.get(RESOURCE_TARGET_SEARCH_PARAM);

  useEffect(() => {
    if (!requestedResourceId) {
      setTargetResourceId(null);
      return;
    }

    if (resourceIds.includes(requestedResourceId)) {
      setTargetResourceId(requestedResourceId);
      return;
    }

    const cleanupSearchParams = new URLSearchParams(searchParams.toString());
    cleanupSearchParams.delete(RESOURCE_TARGET_SEARCH_PARAM);
    const query = cleanupSearchParams.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
    setTargetResourceId(null);
  }, [requestedResourceId, resourceIds, searchParams]);

  return targetResourceId;
}

export function useScrollToResourceTarget(
  resourceId: string | null,
  enabled = true
) {
  useEffect(() => {
    if (!(resourceId && enabled)) {
      return;
    }

    const scrollToTarget = () => {
      document
        .getElementById(getResourceTargetElementId(resourceId))
        ?.scrollIntoView({ behavior: "instant", block: "center" });
    };
    const animationFrame = requestAnimationFrame(scrollToTarget);

    return () => cancelAnimationFrame(animationFrame);
  }, [enabled, resourceId]);
}

export function ResourceTargetScroller({
  resourceIds,
}: {
  resourceIds: string[];
}) {
  return (
    <Suspense fallback={null}>
      <ResourceTargetScrollerContent resourceIds={resourceIds} />
    </Suspense>
  );
}

function ResourceTargetScrollerContent({
  resourceIds,
}: {
  resourceIds: string[];
}) {
  const targetResourceId = useResourceTarget(resourceIds);
  useScrollToResourceTarget(targetResourceId);

  return null;
}
