export const UMAMI_ORIGIN = "https://umami.net-work.studio";
export const UMAMI_PROXY_PATH = "/p";
export const UMAMI_SCRIPT_PATH = "/assets/p.js";
export const UMAMI_COLLECT_PATH = `${UMAMI_PROXY_PATH}/api/send`;

export function shouldTrackWithUmami({
  isDraftMode,
  websiteId,
}: {
  isDraftMode: boolean;
  websiteId: string | undefined;
}) {
  return !isDraftMode && Boolean(websiteId);
}
