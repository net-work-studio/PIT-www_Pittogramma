import type { LogoFields } from "@/components/modules/shared/logo-frame";
import LogoFrameBlock from "@/components/modules/shared/logo-frame-block";

export interface ContributorWithLogo {
  _id: string;
  description: string | null;
  logo: LogoFields | null;
  name: string | null;
}

interface ContributorCardProps {
  contributor: ContributorWithLogo;
}

export default function ContributorCard({ contributor }: ContributorCardProps) {
  return (
    <LogoFrameBlock
      description={contributor.description}
      logo={contributor.logo}
      name={contributor.name}
    />
  );
}
