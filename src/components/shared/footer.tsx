import Link from "next/link";
import { type DynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import Logotype from "../brand/logotype";
import NewsletterSignupForm from "../newsletter/newsletter-signup-form";

const footerLinkListClass = "[&_a]:hover:text-muted-foreground";

export default async function Footer({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: siteSettings } = await sanityFetch({
    perspective,
    query: SITE_SETTINGS_QUERY,
    stega,
  });

  return (
    <footer className="p-4 pt-8">
      <div className="space-y-4 rounded-lg bg-secondary p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}

          <div className="flex h-5 w-full justify-start">
            <Logotype className="h-5 w-[116px] fill-foreground" />
          </div>

          {/* Participate */}
          <ul className={footerLinkListClass}>
            <li>
              <Link href="/submit">Submit your project</Link>
            </li>
            <li>
              <Link href="/contribute">Contribute to the index</Link>
            </li>
          </ul>

          {/* Connect */}
          <ul className={footerLinkListClass}>
            {siteSettings?.instagramUrl ? (
              <li>
                <a
                  href={siteSettings.instagramUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
            ) : null}
            {siteSettings?.linkedinUrl ? (
              <li>
                <a
                  href={siteSettings.linkedinUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
            ) : null}
          </ul>

          {/* Newsletter */}
          <div>
            <p>Newsletter</p>
            <NewsletterSignupForm
              buttonText="Subscribe"
              compact
              source="footer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-foreground/15 border-t pt-4 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pittogramma. All Rights Reserved.</p>
          <ul className={`flex flex-wrap gap-x-4 ${footerLinkListClass}`}>
            <li>
              <Link href="/impressum">Legal Notice</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/submission-terms">Submission Terms</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
