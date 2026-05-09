import MetaItem from "@/components/modules/shared/meta-item";
import { Button } from "@/components/ui/button";

interface NamedRef {
  _id: string;
  name: string | null;
}

interface EditionInfoProps {
  title?: string | null;
  authors?: NamedRef[] | null;
  description?: string | null;
  buyUrl?: string | null;
  year?: number | null;
  designers?: NamedRef[] | null;
  supporters?: NamedRef[] | null;
}

function NameList({ items }: { items: NamedRef[] }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => (
        <li key={item._id}>{item.name}</li>
      ))}
    </ul>
  );
}

export default function EditionInfo({
  title,
  authors,
  description,
  buyUrl,
  year,
  designers,
  supporters,
}: EditionInfoProps) {
  const namedAuthors = authors?.filter((a) => a.name) ?? [];
  const namedDesigners = designers?.filter((d) => d.name) ?? [];
  const namedSupporters = supporters?.filter((s) => s.name) ?? [];

  return (
    <div className="h-fit w-full pr-10 lg:sticky lg:top-20 lg:w-1/3">
      <div className="flex flex-col gap-12.5">
        <div className="flex flex-col gap-1">
          {title ? <h1 className="text-3xl">{title}</h1> : null}
          {namedAuthors.length > 0 ? (
            <p className="text-3xl text-muted-foreground">
              {namedAuthors.map((a) => a.name).join(", ")}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-10">
          {description ? (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {description}
            </p>
          ) : null}

          {buyUrl ? (
            <div>
              <Button asChild size="sm">
                <a href={buyUrl} rel="noopener noreferrer" target="_blank">
                  Buy
                </a>
              </Button>
            </div>
          ) : null}

          <dl className="flex flex-col gap-0.5">
            {year ? <MetaItem label="Year">{year}</MetaItem> : null}
            {namedDesigners.length > 0 ? (
              <MetaItem label="Designers">
                <NameList items={namedDesigners} />
              </MetaItem>
            ) : null}
            {namedSupporters.length > 0 ? (
              <MetaItem label="Supporters">
                <NameList items={namedSupporters} />
              </MetaItem>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
}
