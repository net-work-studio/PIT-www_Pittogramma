import { MultilineText } from "@/components/shared/multiline-text";
import { ScrollFade } from "@/components/shared/scroll-fade";

interface ProjectDescriptionProps {
  description: string | null;
}

export default function ProjectDescription({
  description,
}: ProjectDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <ScrollFade className="h-full flex-1" key={description}>
      <p>
        <MultilineText text={description} />
      </p>
    </ScrollFade>
  );
}
