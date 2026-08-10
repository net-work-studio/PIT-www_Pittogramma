"use client";

import { useEffect, useState } from "react";

import {
  getResourceTargetElementId,
  RESOURCE_TARGET_SEARCH_PARAM,
} from "@/lib/resource-target";

export function useResourceTarget(resourceIds: string[]) {
  const [targetResourceId, setTargetResourceId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const requestedResourceId = searchParams.get(RESOURCE_TARGET_SEARCH_PARAM);

    if (!requestedResourceId) {
      setTargetResourceId(null);
      return;
    }

    if (resourceIds.includes(requestedResourceId)) {
      setTargetResourceId(requestedResourceId);
      return;
    }

    searchParams.delete(RESOURCE_TARGET_SEARCH_PARAM);
    const query = searchParams.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
    setTargetResourceId(null);
  }, [resourceIds]);

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
  const targetResourceId = useResourceTarget(resourceIds);
  useScrollToResourceTarget(targetResourceId);

  return null;
}
