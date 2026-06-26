import LogoFrameBlock from "@/components/modules/shared/logo-frame-block";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

interface AboutSupportersProps {
  supporters?: NonNullable<ABOUT_PAGE_QUERY_RESULT>["supporters"];
}

export default function AboutSupporters({ supporters }: AboutSupportersProps) {
  if (!supporters?.length) {
    return null;
  }

  return (
    <section className="mx-auto mt-16 w-full max-w-250 border-t pt-6 lg:mt-24">
      <p className="mb-6 font-mono text-muted-foreground text-xs uppercase tracking-wide">
        Our Supporters
      </p>
      <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4">
        {supporters.map((supporter) => (
          <LogoFrameBlock
            className="w-full sm:w-full"
            key={supporter._id}
            logo={supporter.logo}
            name={supporter.name}
            sizes="(min-width: 640px) 25vw, 50vw"
            title={supporter.name ?? undefined}
          />
        ))}
      </div>
    </section>
  );
}
