import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import NewsletterCard from "@/components/cards/newsletter-card";
import PageHeader from "@/components/shared/page-header";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x600/1a1a1a/ffffff?text=Placeholder";

const BADGE_TYPES = [
  "project",
  "article",
  "interview",
  "feat",
  "event",
] as const;

export default function ModulesSection() {
  return (
    <section className="space-y-12" id="modules">
      <h2 className="font-mono text-xl uppercase">Modules</h2>

      {/* PageHeader */}
      <div className="space-y-4">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          PageHeader
        </h3>
        <div className="rounded-lg border border-border">
          <PageHeader
            subtitle="A curated collection of design-focused content, showcasing the best in graphic design."
            title="Projects"
          />
        </div>
      </div>

      {/* BaseCard */}
      <div className="space-y-6">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          BaseCard
        </h3>

        <div className="space-y-2">
          <h4 className="font-mono text-xs">Normal &mdash; all badge types</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {BADGE_TYPES.map((variant) => (
              <BaseCard
                authors={[{ name: "Jane Doe" }, { name: "John Smith" }]}
                href="#"
                image={PLACEHOLDER_IMAGE}
                key={variant}
                title={`Sample ${variant} card`}
                variant={variant}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-mono text-xs">Big variant</h4>
          <div className="grid grid-cols-2 gap-6">
            <BaseCard
              authors={[{ name: "Studio Feixen" }]}
              big
              href="#"
              image={PLACEHOLDER_IMAGE}
              title="Featured project with big layout"
              variant="project"
            />
            <BaseCard
              authors={[{ name: "Paula Scher" }]}
              big
              href="#"
              image={PLACEHOLDER_IMAGE}
              title="Featured interview spotlight"
              variant="interview"
            />
          </div>
        </div>
      </div>

      {/* CTACard */}
      <div className="space-y-6">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          CTACard
        </h3>
        <div className="grid max-w-lg grid-cols-1 gap-6">
          <div className="space-y-2">
            <h4 className="font-mono text-xs">Simple</h4>
            <CtaCard
              buttonText="Submit your project"
              externalUrl="#"
              headline="Have a project to share?"
              linkType="external"
              variant="simple"
            />
          </div>
        </div>
      </div>

      {/* NewsletterCard */}
      <div className="space-y-4">
        <h3 className="font-mono text-muted-foreground text-sm uppercase">
          NewsletterCard
        </h3>
        <div className="max-w-sm">
          <NewsletterCard />
        </div>
      </div>
    </section>
  );
}
