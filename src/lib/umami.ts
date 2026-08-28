export function shouldTrackWithUmami({
  isDraftMode,
  websiteId,
}: {
  isDraftMode: boolean;
  websiteId: string | undefined;
}) {
  return !isDraftMode && Boolean(websiteId);
}
