import type { DESIGNER_QUERY_RESULT } from "@/sanity/types";

type Designer = NonNullable<DESIGNER_QUERY_RESULT>;

interface DesignerInfoProps {
  bio: Designer["bio"];
  birthYear: Designer["birthYear"];
  education: Designer["education"];
  location: Designer["location"];
  name: Designer["name"];
  socialLinks: Designer["socialLinks"];
}

export default function DesignerInfo({
  name,
  bio,
  birthYear,
  education,
  location,
  socialLinks,
}: DesignerInfoProps) {
  const locationParts = [location?.city?.name, location?.country?.name].filter(
    Boolean
  );

  const links = socialLinks?.links;

  return (
    <div className="h-fit w-full pr-10 lg:sticky lg:top-14 lg:w-1/3">
      <div className="flex flex-col gap-[50px]">
        <hgroup className="flex flex-col gap-1">
          {name ? <h1 className="text-[2rem] leading-tight">{name}</h1> : null}
          {locationParts.length > 0 ? (
            <h2 className="text-[2rem] text-muted-foreground leading-tight">
              {locationParts.join(", ")}
            </h2>
          ) : null}
        </hgroup>

        <div className="flex flex-col gap-20">
          {bio ? <p>{bio}</p> : null}

          <dl className="flex flex-col gap-4">
            {birthYear ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Born
                </dt>
                <dd className="text-sm">{birthYear}</dd>
              </div>
            ) : null}
            {education?.length ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Education
                </dt>
                <dd>
                  <ul className="flex flex-col gap-1">
                    {education.map(
                      (edu: NonNullable<Designer["education"]>[number]) => (
                        <li className="text-sm" key={edu._key}>
                          {[edu.institute?.name, edu.degree, edu.year]
                            .filter(Boolean)
                            .join(", ")}
                        </li>
                      )
                    )}
                  </ul>
                </dd>
              </div>
            ) : null}
            {links?.length ? (
              <div className="flex gap-x-8">
                <dt className="font-mono text-muted-foreground text-sm uppercase">
                  Links
                </dt>
                <dd>
                  <ul className="flex flex-col gap-1">
                    {links.map((link: NonNullable<typeof links>[number]) => (
                      <li key={link._key}>
                        <a
                          className="text-sm underline"
                          href={link.url ?? "#"}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {link.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
}
