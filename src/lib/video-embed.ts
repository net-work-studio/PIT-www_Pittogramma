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
      controls: "0",
      loop: "1",
      modestbranding: "1",
      mute: "1",
      playlist: id,
      playsinline: "1",
      rel: "0",
    });
    return {
      provider: "youtube",
      src: `https://www.youtube.com/embed/${id}?${params.toString()}`,
    };
  }

  const vimeoMatch = url.match(VIMEO_REGEX);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      background: "1",
      loop: "1",
      muted: "1",
    });
    return {
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${id}?${params.toString()}`,
    };
  }

  return null;
}
