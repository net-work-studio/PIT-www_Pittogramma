import Link from "next/link";

import { type DynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

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
        <ul>
          <li>Pittogramma</li>
          <li>
            <p>© {new Date().getFullYear()}. All Rights Reserved</p>
          </li>
        </ul>
        {/* Col 2 */}
        <ul>
          {siteSettings?.substackUrl && (
            <li>
              <a
                href={siteSettings.substackUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Subscribe to our Substack
              </a>
            </li>
          )}
          {siteSettings?.instagramUrl && (
            <li>
              <a
                href={siteSettings.instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Follow us on Instagram
              </a>
            </li>
          )}
          {siteSettings?.spotifyUrl && (
            <li>
              <a
                href={siteSettings.spotifyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Listen our music on Spotify
              </a>
            </li>
          )}
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
        <ul>
          <li>
            <Link href="/terms-of-service">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/terms-of-service">Impressum</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
