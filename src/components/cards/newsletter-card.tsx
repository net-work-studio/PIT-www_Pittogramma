import NewsletterSignupForm from "@/components/newsletter/newsletter-signup-form";

export default function NewsletterCard() {
  return (
    <div className="rounded bg-foreground p-2.5 text-background">
      <h2 className="font-mono text-[10px]">Newsletter</h2>
      <p>
        Do you want to be updated on projects, interviews, events and other
        contents about graphic design?
      </p>
      <NewsletterSignupForm
        buttonText="Subscribe"
        className="mt-3"
        compact
        source="newsletter_card"
      />
    </div>
  );
}
