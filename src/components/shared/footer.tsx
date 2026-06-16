import Link from "next/link";
import { type DynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import NewsletterSignupForm from "../newsletter/newsletter-signup-form";
import Logotype from "../brand/logotype";

export default async function Footer({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: siteSettings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    perspective,
    stega,
  });

  return (
    <footer className="p-4">
      <div className="grid grid-cols-1 gap-4 rounded-lg bg-secondary p-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {/* Col 1 */}
        <ul className="flex flex-col items-start gap-1">
          <li className="h-5">
            <Logotype/>
          </li>
          <li>
            <p>© {new Date().getFullYear()}. All Rights Reserved</p>
          </li>
          <br />
          <li className="w-fit text-muted-foreground decoration-1 underline-offset-4 hover:underline">
            <Link href="/terms-of-service">Privacy Policy</Link>
          </li>
          <li className="w-fit text-muted-foreground decoration-1 underline-offset-4 hover:underline">
            <Link href="/terms-of-service">Impressum</Link>
          </li>
        </ul>
        {/* Col 2 */}
        <ul className="">
          {siteSettings?.instagramUrl ? (
            <li>
              <a
                href={siteSettings.instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Follow us on Instagram
              </a>
            </li>
          ) : null}
          {siteSettings?.spotifyUrl ? (
            <li>
              <a
                href={siteSettings.spotifyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Listen our music on Spotify
              </a>
            </li>
          ) : null}
        </ul>

        {/* Col 3 */}
        <ul>
          <li>
            <Link href="/submit">Submit your project</Link>
          </li>
          <li>
            <Link href="/contribute">Contribute to the repository</Link>
          </li>
          <li>
            <Link href="/donate">Donate to the project</Link>
          </li>
        </ul>

        {/* Col 4 */}
        <div>
          <p className="">Newsletter</p>
          <NewsletterSignupForm
            buttonText="Subscribe"
            compact
            source="footer"
          />
        </div>
      </div>
    </footer>
  );
}
