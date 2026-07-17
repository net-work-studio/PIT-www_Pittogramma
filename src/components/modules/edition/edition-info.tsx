import MetaItem from "@/components/modules/shared/meta-item";
import { Button } from "@/components/ui/button";

interface NamedRef {
  _id: string;
  name: string | null;
}

interface EditionInfoProps {
  authors?: NamedRef[] | null;
  buyUrl?: string | null;
  description?: string | null;
  designers?: NamedRef[] | null;
  supporters?: NamedRef[] | null;
  title?: string | null;
  year?: number | null;
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
              <Button
                render={
                  // biome-ignore lint/a11y/useAnchorContent: Base UI injects the Button children into this render element.
                  <a href={buyUrl} rel="noopener noreferrer" target="_blank" />
                }
                size="sm"
              >
                Buy
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
