import { AspectRatio } from "@/components/ui/aspect-ratio";

const metaValueWidths = ["w-32", "w-28", "w-12", "w-24"];
const shareLinkWidths = ["w-14", "w-16", "w-5", "w-20"];
const relatedCardSkeletons = ["first", "second", "third", "fourth"];

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted ${className}`} />;
}

export default function Loading() {
  return (
    <div aria-busy aria-label="Loading project" role="status">
      <span className="sr-only">Loading project</span>
      <div className="flex flex-col py-6 lg:flex-row">
        <aside className="h-fit w-full pr-0 pb-10 lg:sticky lg:top-20 lg:w-1/3 lg:pr-10 lg:pb-0">
          <div className="flex flex-col gap-12.5">
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-24 rounded" />
              <SkeletonBlock className="h-9 w-10/12 max-w-sm rounded-md" />
              <SkeletonBlock className="h-9 w-7/12 max-w-xs rounded-md" />
            </div>

            <div className="flex flex-col gap-20">
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-full rounded" />
                <SkeletonBlock className="h-4 w-11/12 rounded" />
                <SkeletonBlock className="h-4 w-9/12 rounded" />
              </div>

              <dl className="flex flex-col gap-2.5">
                {["Institute", "Teacher", "Year", "Disciplines"].map(
                  (label, index) => {
                    const valueWidth = metaValueWidths[index];

                    return (
                      <div className="flex gap-2" key={label}>
                        <dt className="w-1/2">
                          <SkeletonBlock className="h-4 w-20 rounded" />
                        </dt>
                        <dd className="w-1/2">
                          <SkeletonBlock
                            className={`h-4 rounded ${valueWidth}`}
                          />
                        </dd>
                      </div>
                    );
                  }
                )}
              </dl>
            </div>
          </div>
        </aside>

        <div className="w-full lg:w-2/3">
          <AspectRatio
            className="relative overflow-hidden rounded-3xl"
            ratio={4 / 3}
          >
            <SkeletonBlock className="h-full w-full rounded-3xl" />
          </AspectRatio>

          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
            <AspectRatio
              className="relative flex-1 overflow-hidden rounded-xl"
              ratio={4 / 3}
            >
              <SkeletonBlock className="h-full w-full rounded-xl" />
            </AspectRatio>
            <AspectRatio
              className="relative flex-1 overflow-hidden rounded-xl"
              ratio={4 / 3}
            >
              <SkeletonBlock className="h-full w-full rounded-xl" />
            </AspectRatio>
          </div>

          <AspectRatio
            className="relative mt-2.5 overflow-hidden rounded-3xl"
            ratio={4 / 3}
          >
            <SkeletonBlock className="h-full w-full rounded-3xl" />
          </AspectRatio>

          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            <SkeletonBlock className="h-4 w-11 rounded" />
            {shareLinkWidths.map((widthClass) => (
              <SkeletonBlock
                className={`h-4 rounded ${widthClass}`}
                key={widthClass}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="flex flex-col border-border border-t pt-2.5">
        <SkeletonBlock className="mb-4 h-5 w-28 rounded" />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedCardSkeletons.map((key) => (
            <div className="flex h-fit w-full flex-col gap-2.5" key={key}>
              <AspectRatio
                className="relative overflow-hidden rounded-lg"
                ratio={4 / 3}
              >
                <SkeletonBlock className="h-full w-full rounded-lg" />
              </AspectRatio>
              <div className="space-y-1">
                <SkeletonBlock className="h-5 w-10/12 rounded" />
                <SkeletonBlock className="h-4 w-7/12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
