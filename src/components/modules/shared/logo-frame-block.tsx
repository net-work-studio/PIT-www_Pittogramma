import LogoFrame, {
  type LogoFields,
} from "@/components/modules/shared/logo-frame";
import { cn } from "@/lib/utils";

interface LogoFrameBlockProps {
  className?: string;
  description?: string | null;
  logo: LogoFields | null;
  name?: string | null;
  sizes?: string;
  title?: string;
}

export default function LogoFrameBlock({
  className,
  description,
  logo,
  name,
  sizes,
  title,
}: LogoFrameBlockProps) {
  return (
    <div
      className={cn("flex w-48 flex-col gap-3 sm:w-56", className)}
      title={title}
    >
      <LogoFrame logo={logo} name={name} sizes={sizes} />
      {description ? (
        <p className="text-sm leading-normal">{description}</p>
      ) : null}
    </div>
  );
}
