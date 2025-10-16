import { Button } from "@/components/ui/button";

type CtaCardProps = {
  title: string;
  description: string;
  buttonText: string;
};

export default function CtaCard({
  title,
  description,
  buttonText,
}: CtaCardProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-2.5 rounded-[10px] bg-secondary p-2.5">
      <h3>{title}</h3>
      <p>{description}</p>
      <Button variant="outline">{buttonText}</Button>
    </div>
  );
}
