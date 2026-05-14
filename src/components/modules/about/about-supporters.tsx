import SanityImage from "@/components/modules/shared/sanity-image";
import { cn } from "@/lib/utils";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

type Supporter = NonNullable<
  NonNullable<ABOUT_PAGE_QUERY_RESULT>["supporters"]
>[number];

interface AboutSupportersProps {
  supporters?: NonNullable<ABOUT_PAGE_QUERY_RESULT>["supporters"];
}

function SupporterLogo({ supporter }: { supporter: Supporter }) {
  const alt = supporter.logo?.alt ?? supporter.name ?? "";
  const light = supporter.logo?.logoLight;
  const dark = supporter.logo?.logoDark;
  const heightClass = "h-8 lg:h-10";
  const hasBoth = Boolean(light && dark);

  return (
    <div className="flex items-center" title={supporter.name ?? undefined}>
      {light ? (
        <div
          className={cn(
            "relative",
            heightClass,
            "w-auto",
            hasBoth && "dark:hidden"
          )}
        >
          <SanityImage
            alt={alt}
            className="h-full w-auto object-contain"
            height={40}
            sizes="160px"
            source={{ image: light, alt }}
            width={160}
          />
        </div>
      ) : null}
      {dark ? (
        <div
          className={cn(
            "relative",
            heightClass,
            "w-auto",
            hasBoth && "hidden dark:block"
          )}
        >
          <SanityImage
            alt={alt}
            className="h-full w-auto object-contain"
            height={40}
            sizes="160px"
            source={{ image: dark, alt }}
            width={160}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function AboutSupporters({ supporters }: AboutSupportersProps) {
  if (!supporters?.length) {
    return null;
  }

  return (
    <section className="mt-16 border-t pt-6 lg:mt-24">
      <p className="mb-6 font-mono text-muted-foreground text-xs uppercase tracking-wide">
        Our Supporters
      </p>
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
        {supporters.map((supporter) => (
          <SupporterLogo key={supporter._id} supporter={supporter} />
        ))}
      </div>
    </section>
  );
}
