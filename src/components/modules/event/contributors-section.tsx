import LogoFrame, {
  type ContributorWithLogo,
} from "@/components/modules/shared/logo-frame";

interface ContributorsSectionProps {
  partners?: ContributorWithLogo[] | null;
  sponsors?: ContributorWithLogo[] | null;
}

function ContributorGroup({
  label,
  contributors,
}: {
  label: string;
  contributors: ContributorWithLogo[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs uppercase">{label}</p>
      <div className="flex flex-wrap gap-4">
        {contributors.map((contributor) => (
          <LogoFrame
            description={contributor.description}
            key={contributor._id}
            logo={contributor.logo}
            name={contributor.name}
          />
        ))}
      </div>
    </div>
  );
}

export default function ContributorsSection({
  sponsors,
  partners,
}: ContributorsSectionProps) {
  const validSponsors = sponsors?.filter(Boolean) ?? [];
  const validPartners = partners?.filter(Boolean) ?? [];

  if (validSponsors.length === 0 && validPartners.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-8 border-foreground border-t-[0.5px] pt-6">
      {validSponsors.length > 0 ? (
        <ContributorGroup
          contributors={validSponsors}
          label={validSponsors.length === 1 ? "Sponsor" : "Sponsors"}
        />
      ) : null}
      {validPartners.length > 0 ? (
        <ContributorGroup
          contributors={validPartners}
          label={validPartners.length === 1 ? "Partner" : "Partners"}
        />
      ) : null}
    </div>
  );
}
