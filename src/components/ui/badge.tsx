import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 pt-[1.1px] font-mono text-xs uppercase outline outline-foreground transition-color transition-color duration-300 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:outline-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        project:
          "group-hover:bg-blue-700 group-hover:text-white group-hover:outline-blue-700",
        article:
          "group-hover:bg-orange-500 group-hover:text-white group-hover:outline-orange-500",
        diary:
          "group-hover:bg-green-500 group-hover:text-black group-hover:outline-green-500",
        baseline:
          "group-hover:bg-blue-700 group-hover:text-white group-hover:outline-blue-700",
        interview:
          "group-hover:bg-yellow-500 group-hover:text-black group-hover:outline-yellow-500",
        feat: "group-hover:bg-background group-hover:text-foreground group-hover:outline-background",
        outline: "",
        event: "group-hover:bg-background group-hover:text-foreground",
        "event-coming-soon":
          "group-hover:bg-blue-700 group-hover:text-white group-hover:outline-blue-700",
        "event-available":
          "group-hover:bg-green-500 group-hover:text-black group-hover:outline-green-500",
        "event-sold-out":
          "group-hover:bg-destructive group-hover:text-destructive-foreground group-hover:outline-destructive",
        "event-waitlist":
          "group-hover:bg-orange-500 group-hover:text-white group-hover:outline-orange-500",
        "event-postponed":
          "group-hover:bg-yellow-500 group-hover:text-black group-hover:outline-yellow-500",
        "event-cancelled":
          "group-hover:bg-destructive group-hover:text-destructive-foreground group-hover:outline-destructive",
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
