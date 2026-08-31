import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const firstParagraphWidths = ["w-full", "w-11/12", "w-10/12", "w-8/12"];
const secondParagraphWidths = ["w-full", "w-11/12", "w-9/12"];
const shareLinkWidths = ["w-14", "w-16", "w-5", "w-20"];

function TextSkeleton({ widths }: { widths: string[] }) {
  return (
    <div className="mx-auto flex max-w-175 flex-col gap-3">
      {widths.map((width) => (
        <Skeleton className={`h-7 ${width}`} key={width} />
      ))}
    </div>
  );
}

interface EditorialArticleSkeletonProps {
  type: "interview" | "journal";
}

export default function EditorialArticleSkeleton({
  type,
}: EditorialArticleSkeletonProps) {
  const isJournal = type === "journal";

  return (
    <div aria-busy aria-label={`Loading ${type}`} role="status">
      <span className="sr-only">Loading {type}</span>

      <header className="px-2.5 pt-7.5">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={16 / 9}
        >
          <Skeleton className="h-full w-full" />
        </AspectRatio>

        <div className="mx-auto flex w-full flex-col items-center gap-2 pt-7.5 text-center lg:max-w-[65%]">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-10/12 md:w-8/12" />
          <Skeleton className="h-8 w-7/12 md:w-5/12" />
          <Skeleton className="mt-1 h-4 w-24" />
        </div>
      </header>

      <div className="px-2.5 py-16 lg:py-24">
        <TextSkeleton widths={firstParagraphWidths} />

        <div className="my-10 lg:mx-auto lg:max-w-[65%]">
          <AspectRatio
            className="relative overflow-hidden rounded-xl"
            ratio={4 / 3}
          >
            <Skeleton className="h-full w-full" />
          </AspectRatio>
        </div>

        <TextSkeleton widths={secondParagraphWidths} />
      </div>

      {isJournal ? (
        <div className="px-2.5">
          <div className="mx-auto max-w-175 rounded-lg bg-muted p-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-5 w-10/12" />
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-baseline gap-2.5 px-2.5">
        <Skeleton className="h-4 w-11" />
        {shareLinkWidths.map((width) => (
          <Skeleton className={`h-4 ${width}`} key={width} />
        ))}
      </div>
    </div>
  );
}
