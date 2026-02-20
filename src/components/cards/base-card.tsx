import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BASE_CARD_IMAGE_WIDTH = 4;
const BASE_CARD_IMAGE_HEIGHT = 3;
const BASE_CARD_IMAGE_RATIO = BASE_CARD_IMAGE_WIDTH / BASE_CARD_IMAGE_HEIGHT;

interface Author {
  name: string;
}

interface BaseCardProps {
  authors?: Author[];
  big?: boolean;
  blurDataURL?: string;
  href: string;
  image: string;
  title: string;
  variant?: "project" | "article" | "interview" | "feat" | "event";
}

export default function BaseCard({
  title,
  authors,
  image,
  blurDataURL,
  variant,
  href,
  big,
}: BaseCardProps) {
  return (
    <Link
      className={cn(
        "span-col-1 group flex h-fit w-full flex-col items-start justify-center gap-2.5 rounded-[1.25rem]",
        big ? "col-span-2" : "col-span-1"
      )}
      href={href}
    >
      <AspectRatio
        className="relative overflow-hidden rounded-lg"
        ratio={BASE_CARD_IMAGE_RATIO}
      >
        <Image
          alt={title}
          className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          quality={75}
          src={image}
          {...(blurDataURL
            ? { placeholder: "blur" as const, blurDataURL }
            : {})}
        />
      </AspectRatio>
      {variant ? <Badge variant={variant} /> : null}
      <div className="inline-flex w-full flex-col items-start justify-start gap-3">
        <hgroup className="flex flex-col items-start justify-start gap-2 self-stretch">
          <h3 className="justify-start self-stretch font-normal font-sans text-base text-black">
            {title}
          </h3>
          {authors && authors.length > 0 ? (
            <ul className="flex items-start justify-start gap-1 font-normal font-sans text-neutral-400 text-xs">
              {authors.map((author, index) => (
                <li key={author.name}>
                  {author.name}
                  {index < authors.length - 1 && ", "}
                </li>
              ))}
            </ul>
          ) : null}
        </hgroup>
      </div>
    </Link>
  );
}
