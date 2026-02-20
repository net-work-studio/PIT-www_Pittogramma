interface ShareLinksProps {
  title: string;
  url: string;
}

const platforms = [
  {
    name: "LinkedIn",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Pinterest",
    getUrl: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  {
    name: "X",
    getUrl: (url: string, title: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "WhatsApp",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

export default function ShareLinks({ url, title }: ShareLinksProps) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2.5">
      <span className="font-mono text-muted-foreground text-sm uppercase">
        Share
      </span>
      {platforms.map((platform) => (
        <a
          className="text-sm underline"
          href={platform.getUrl(url, title)}
          key={platform.name}
          rel="noopener noreferrer"
          target="_blank"
        >
          {platform.name}
        </a>
      ))}
    </div>
  );
}
