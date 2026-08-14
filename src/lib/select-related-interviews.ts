interface RelatedInterview {
  _id: string;
}

export function selectRelatedInterviews<T extends RelatedInterview>({
  fallbackInterviews,
  random = Math.random,
  relatedInterviews,
}: {
  fallbackInterviews?: T[];
  random?: () => number;
  relatedInterviews?: T[];
}): T[] {
  const selectedInterviews = relatedInterviews?.slice(0, 4) ?? [];
  const candidates = [...(fallbackInterviews ?? [])];

  while (selectedInterviews.length < 4 && candidates.length > 0) {
    const index = Math.floor(random() * candidates.length);
    const [candidate] = candidates.splice(index, 1);

    if (candidate) {
      selectedInterviews.push(candidate);
    }
  }

  return selectedInterviews;
}
