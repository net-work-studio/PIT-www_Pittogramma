"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background shadow-lg transition-transform duration-500 ease-in-out data-ending-style:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-ending-style:-translate-y-full data-starting-style:-translate-y-full",
        bottom:
          "inset-x-0 bottom-0 border-t data-ending-style:translate-y-full data-starting-style:translate-y-full",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-ending-style:-translate-x-full data-starting-style:-translate-x-full sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-ending-style:translate-x-full data-starting-style:translate-x-full sm:max-w-md",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

function SheetContent({
  side = "right",
  className,
  overlayClassName,
  children,
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof sheetVariants> & { overlayClassName?: string }) {
  return (
    <SheetPortal>
      <SheetOverlay className={overlayClassName} />
      <DialogPrimitive.Popup
        className={cn(sheetVariants({ side }), className)}
        data-side={side}
        data-slot="sheet-content"
        {...props}
      >
        <DialogPrimitive.Close
          className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
          data-slot="sheet-close"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      data-slot="sheet-header"
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-6 pt-0", className)}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("font-semibold text-foreground text-lg", className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
