interface Tag {
  _id: string;
  name: string;
}

interface TagsDisplayProps {
  tags: Tag[] | null | undefined;
  separator?: string;
}

export function TagsDisplay({ tags, separator = ", " }: TagsDisplayProps) {
  if (!tags || tags.length === 0) {
    return <>-</>;
  }

  return <>{tags.map((tag) => tag.name).join(separator)}</>;
}
