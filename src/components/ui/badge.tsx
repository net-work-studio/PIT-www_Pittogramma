import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 pt-1 pb-[2.3px] font-mono text-xs uppercase uppercase outline-[0.8px] outline-foreground transition-color transition-color duration-200 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:outline-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    defaultVariants: {
      variant: "project",
    },
    variants: {
      variant: {
        article:
          "group-hover:bg-orange-500 group-hover:text-white group-hover:outline-orange-500",
        baseline:
          "group-hover:bg-purple-500 group-hover:text-white group-hover:outline-purple-500",
        bronze:
          "group-hover:bg-amber-700 group-hover:text-white group-hover:outline-amber-700",
        "detail-article": "bg-orange-500 text-white outline-orange-500",
        "detail-baseline": "bg-purple-500 text-white outline-purple-500",
        "detail-diary": "bg-green-500 text-black outline-green-500",
        "detail-event": "bg-pink-300 text-black outline-pink-300",
        "detail-interview": "bg-yellow-500 text-black outline-yellow-500",
        "detail-project": "bg-blue-700 text-white outline-blue-700",
        diary:
          "group-hover:bg-green-500 group-hover:text-black group-hover:outline-green-500",
        event: "group-hover:bg-background group-hover:text-foreground",
        "event-type":
          "hover:bg-pink-300 hover:text-black hover:outline-pink-300 group-hover:bg-pink-300 group-hover:text-black group-hover:outline-pink-300",
        feat: "group-hover:bg-background group-hover:text-foreground group-hover:outline-background",
        gold: "group-hover:bg-yellow-500 group-hover:text-black group-hover:outline-yellow-500",
        interview:
          "group-hover:bg-yellow-500 group-hover:text-black group-hover:outline-yellow-500",
        journal:
          "group-hover:bg-foreground group-hover:text-background group-hover:outline-foreground",
        outline: "",
        project:
          "group-hover:bg-blue-700 group-hover:text-white group-hover:outline-blue-700",
        silver:
          "group-hover:bg-neutral-400 group-hover:text-black group-hover:outline-neutral-400",
      },
    },
  }
);

function Badge({
  className,
  variant,
  children,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  const content = children || variant?.toUpperCase();

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        children: content,
        className: cn(badgeVariants({ variant }), className),
        "data-slot": "badge",
      } as React.ComponentProps<"span">,
      props
    ),
    render,
  });
}

export { Badge, badgeVariants };
