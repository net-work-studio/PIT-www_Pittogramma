interface Tag {
  _id: string;
  name: string;
}

interface TagsDisplayProps {
  separator?: string;
  tags: Tag[] | null | undefined;
}

export function TagsDisplay({ tags, separator = ", " }: TagsDisplayProps) {
  if (!tags || tags.length === 0) {
    return <>-</>;
  }

  return <>{tags.map((tag) => tag.name).join(separator)}</>;
}
