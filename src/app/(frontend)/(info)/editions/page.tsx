import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/shared/page-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const data = [
  {
    slug: "12",
    cover: "https://placehold.co/800x600/png",
    title: "Edition 1",
  },
  {
    slug: "34",
    cover: "https://placehold.co/800x600/png",
    title: "Edition 2",
  },
];

interface EditionCardProps {
  slug: string;
  cover: string;
  title: string;
}

function EditionCard({ slug, cover, title }: EditionCardProps) {
  return (
    <Link href={`/editions/${slug}`}>
      <AspectRatio className="relative rounded-lg" ratio={4 / 3}>
        <Image
          alt={title}
          className="h-full w-full rounded-lg object-cover"
          fill
          src={cover}
        />
      </AspectRatio>
    </Link>
  );
}

export default function Page() {
  return (
    <>
      <PageHeader subtitle="Her text.." title="Editions" />
      <div className="grid grid-cols-2 gap-2.5">
        {data.map((item) => (
          <EditionCard key={item.slug} {...item} />
        ))}
      </div>
    </>
  );
}
