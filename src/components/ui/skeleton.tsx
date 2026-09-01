import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted-foreground/15",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
