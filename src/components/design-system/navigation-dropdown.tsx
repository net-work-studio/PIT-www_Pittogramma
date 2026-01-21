import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationDropdownProps {
  title: string;
  links: { href: string; label: string }[];
}

export default function NavigationDropdown({
  title,
  links,
}: NavigationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {links.map(({ href, label }) => (
          <DropdownMenuItem key={href}>
            <Link href={href}>{label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
