import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-sm uppercase transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        project: "border-transparent bg-blue-700 text-white",
        article: "border-transparent bg-orange-500 text-white",
        interview: "border-transparent bg-yellow-500 text-black",
        feat: "border-foreground bg-transparent text-foreground text-foreground",
        event: "border-transparent bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "project",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  const content = children || variant?.toUpperCase();

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-slot="badge"
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Badge, badgeVariants };
