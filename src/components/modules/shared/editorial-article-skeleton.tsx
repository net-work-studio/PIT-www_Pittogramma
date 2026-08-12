import { AspectRatio } from "@/components/ui/aspect-ratio";

const firstParagraphWidths = ["w-full", "w-11/12", "w-10/12", "w-8/12"];
const secondParagraphWidths = ["w-full", "w-11/12", "w-9/12"];
const shareLinkWidths = ["w-14", "w-16", "w-5", "w-20"];

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted ${className}`} />;
}

function TextSkeleton({ widths }: { widths: string[] }) {
  return (
    <div className="mx-auto max-w-175 space-y-3">
      {widths.map((width) => (
        <SkeletonBlock className={`h-7 rounded ${width}`} key={width} />
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
          <SkeletonBlock className="h-full w-full rounded-xl" />
        </AspectRatio>

        <div className="mx-auto flex w-full flex-col items-center gap-2 pt-7.5 text-center lg:max-w-[65%]">
          <SkeletonBlock className="h-5 w-24 rounded" />
          <SkeletonBlock className="h-8 w-10/12 rounded md:w-8/12" />
          <SkeletonBlock className="h-8 w-7/12 rounded md:w-5/12" />
          <SkeletonBlock className="mt-1 h-4 w-24 rounded" />
        </div>
      </header>

      <div className="px-2.5 py-16 lg:py-24">
        <TextSkeleton widths={firstParagraphWidths} />

        <div className="my-10 lg:mx-auto lg:max-w-[65%]">
          <AspectRatio
            className="relative overflow-hidden rounded-xl"
            ratio={4 / 3}
          >
            <SkeletonBlock className="h-full w-full rounded-xl" />
          </AspectRatio>
        </div>

        <TextSkeleton widths={secondParagraphWidths} />
      </div>

      {isJournal ? (
        <div className="px-2.5">
          <div className="mx-auto max-w-175 rounded-lg bg-muted p-6">
            <SkeletonBlock className="h-3 w-20 rounded" />
            <SkeletonBlock className="mt-3 h-5 w-10/12 rounded" />
            <SkeletonBlock className="mt-4 h-10 w-full rounded" />
          </div>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-baseline gap-2.5 px-2.5">
        <SkeletonBlock className="h-4 w-11 rounded" />
        {shareLinkWidths.map((width) => (
          <SkeletonBlock className={`h-4 rounded ${width}`} key={width} />
        ))}
      </div>
    </div>
  );
}
