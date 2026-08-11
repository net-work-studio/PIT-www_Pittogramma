export const RESOURCE_TARGET_SEARCH_PARAM = "resource";

export function buildResourceTargetHref(pathname: string, resourceId: string) {
  const searchParams = new URLSearchParams({
    [RESOURCE_TARGET_SEARCH_PARAM]: resourceId,
  });

  return `${pathname}?${searchParams.toString()}`;
}

export function getResourceTargetElementId(resourceId: string) {
  return `resource-${resourceId}`;
}
