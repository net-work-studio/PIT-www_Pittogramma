import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function Footer() {
  const siteSettings = await client.fetch(SITE_SETTINGS_QUERY);

  return (
    <footer className="p-4">
      <div className="grid grid-cols-4 rounded-lg bg-secondary p-4">
        {/* Col 1 */}
        <ul>
          <li>© {new Date().getFullYear()} Pittogramma</li>
          <li>
            <p>All Rights Resereved</p>
          </li>
          <li>
            <Link href="/terms-of-service">Privacy Policy</Link>
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
      </div>
    </footer>
  );
}
