import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Author = {
  name: string;
};

type BaseCardProps = {
  title: string;
  authors?: Author[];
  image: string;
  href: string;
  variant?: "project" | "article" | "interview" | "feat" | "event";
  big?: boolean;
};

export default function BaseCard({
  title,
  authors,
  image,
  variant,
  href,
  big,
}: BaseCardProps) {
  return (
    <Link
      className={cn(
        "span-col-1 flex h-fit w-full flex-col items-start justify-center gap-2.5 rounded-[1.25rem] bg-stone-50 p-2.5",
        big ? "col-span-2" : "col-span-1"
      )}
      href={href}
    >
      {variant && <Badge variant={variant} />}
      <div className="inline-flex w-full flex-col items-start justify-start gap-3">
        <hgroup className="flex flex-col items-start justify-start gap-2 self-stretch">
          <h3 className="justify-start self-stretch font-normal font-sans text-base text-black">
            {title}
          </h3>
          {authors && authors.length > 0 && (
            <ul className="flex items-start justify-start gap-1 font-normal font-sans text-neutral-400 text-xs">
              {authors.map((author, index) => (
                <li key={author.name}>
                  {author.name}
                  {index < authors.length - 1 && ", "}
                </li>
              ))}
            </ul>
          )}
        </hgroup>
      </div>
      <AspectRatio className="relative rounded-lg" ratio={4 / 3}>
        <Image
          alt=""
          className="h-full w-full rounded-lg object-cover"
          fill
          quality={75}
          src={image}
        />
      </AspectRatio>
    </Link>
  );
}
