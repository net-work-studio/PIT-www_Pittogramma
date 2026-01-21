type Language = {
  _id: string;
  name: string;
};

type LanguagesDisplayProps = {
  languages: Language[] | null | undefined;
  separator?: string;
};

export function LanguagesDisplay({
  languages,
  separator = ", ",
}: LanguagesDisplayProps) {
  if (!languages || languages.length === 0) {
    return <>-</>;
  }

  return <>{languages.map((lang) => lang.name).join(separator)}</>;
}
