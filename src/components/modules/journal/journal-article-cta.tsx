import NewsletterSignupForm from "@/components/newsletter/newsletter-signup-form";

export default function JournalArticleCta() {
  return (
    <div className="mx-auto max-w-[700px] rounded-lg bg-foreground p-6 text-background">
      <p className="font-mono text-[10px] uppercase">Newsletter</p>
      <p className="mt-2 text-base lg:text-lg">
        Do you want to be updated on next articles?
      </p>
      <NewsletterSignupForm
        buttonText="Subscribe to our newsletter"
        className="mt-4"
        source="journal_article"
      />
    </div>
  );
}
