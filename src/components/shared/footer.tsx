import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Footer() {
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
          <li>
            <a
              href="https://www.substack.com//"
              rel="noopener noreferrer"
              target="_blank"
            >
              Subscribe to our Substack
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/pittogramma/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Follow us on Instagram
            </a>
          </li>
          <li>
            <a
              href="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=5857091609b34546"
              rel="noopener noreferrer"
              target="_blank"
            >
              Listen our music on Spotify
            </a>
          </li>
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

        <div className="place-self-end">
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
