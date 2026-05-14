const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
const VIMEO_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export interface EmbedInfo {
  provider: "youtube" | "vimeo";
  src: string;
}

export function getEmbedInfo(url: string | null | undefined): EmbedInfo | null {
  if (!url) {
    return null;
  }

  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: id,
      controls: "0",
      modestbranding: "1",
      playsinline: "1",
      rel: "0",
    });
    return {
      src: `https://www.youtube.com/embed/${id}?${params.toString()}`,
      provider: "youtube",
    };
  }

  const vimeoMatch = url.match(VIMEO_REGEX);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      muted: "1",
      loop: "1",
      background: "1",
    });
    return {
      src: `https://player.vimeo.com/video/${id}?${params.toString()}`,
      provider: "vimeo",
    };
  }

  return null;
}
