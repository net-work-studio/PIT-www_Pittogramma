"use client";

import { ChevronDown, Mail, Plus } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-muted-foreground text-sm uppercase">
      {children}
    </h3>
  );
}

function ComponentBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-xs">{label}</h4>
      {children}
    </div>
  );
}

const BUTTON_VARIANTS = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const BUTTON_SIZES = ["default", "sm", "lg", "icon"] as const;

const BADGE_VARIANTS = [
  "project",
  "article",
  "interview",
  "feat",
  "event",
] as const;

export default function UiSection() {
  const [checkboxOne, setCheckboxOne] = useState(true);
  const [checkboxTwo, setCheckboxTwo] = useState(false);
  const [radioValue, setRadioValue] = useState("option-1");

  return (
    <section className="space-y-12" id="ui-components">
      <h2 className="font-mono text-xl uppercase">UI Components</h2>

      {/* Button */}
      <div className="space-y-6">
        <SectionLabel>Button</SectionLabel>

        <ComponentBlock label="Variants">
          <div className="flex flex-wrap items-center gap-3">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
        </ComponentBlock>

        <ComponentBlock label="Sizes">
          <div className="flex flex-wrap items-center gap-3">
            {BUTTON_SIZES.map((size) => (
              <Button key={size} size={size}>
                {size === "icon" ? <Plus /> : size}
              </Button>
            ))}
          </div>
        </ComponentBlock>

        <ComponentBlock label="With Icon">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <Mail /> Send Email
            </Button>
            <Button variant="outline">
              <Mail /> Send Email
            </Button>
          </div>
        </ComponentBlock>
      </div>

      {/* Badge */}
      <div className="space-y-6">
        <SectionLabel>Badge</SectionLabel>
        <ComponentBlock label="Variants (hover to see color)">
          <div className="flex flex-wrap gap-3">
            {BADGE_VARIANTS.map((variant) => (
              <div className="group cursor-pointer" key={variant}>
                <Badge variant={variant} />
              </div>
            ))}
          </div>
        </ComponentBlock>
      </div>

      {/* Input */}
      <div className="space-y-6">
        <SectionLabel>Input</SectionLabel>
        <div className="max-w-sm space-y-4">
          <ComponentBlock label="Default">
            <Input placeholder="Type something..." />
          </ComponentBlock>
          <ComponentBlock label="With value">
            <Input defaultValue="Hello world" />
          </ComponentBlock>
          <ComponentBlock label="Disabled">
            <Input disabled placeholder="Disabled input" />
          </ComponentBlock>
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-6">
        <SectionLabel>Accordion</SectionLabel>
        <div className="max-w-lg">
          <Accordion collapsible type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Pittogramma?</AccordionTrigger>
              <AccordionContent>
                A design-focused content platform showcasing projects,
                interviews, and design resources.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What technologies are used?</AccordionTrigger>
              <AccordionContent>
                Next.js 16, Sanity CMS, TypeScript, Tailwind CSS 4, and
                shadcn/ui components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How is content managed?</AccordionTrigger>
              <AccordionContent>
                Content is managed through Sanity Studio, accessible at /admin.
                GROQ queries fetch data for server-rendered pages.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <SectionLabel>Tabs</SectionLabel>
        <div className="max-w-lg">
          <Tabs defaultValue="tab-1">
            <TabsList>
              <TabsTrigger value="tab-1">Projects</TabsTrigger>
              <TabsTrigger value="tab-2">Interviews</TabsTrigger>
              <TabsTrigger value="tab-3">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="tab-1">
              <p className="pt-3 text-muted-foreground text-sm">
                Featured design projects from around the world.
              </p>
            </TabsContent>
            <TabsContent value="tab-2">
              <p className="pt-3 text-muted-foreground text-sm">
                In-depth conversations with leading designers.
              </p>
            </TabsContent>
            <TabsContent value="tab-3">
              <p className="pt-3 text-muted-foreground text-sm">
                Bibliography, bookshops, glossaries, and more.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog */}
      <div className="space-y-6">
        <SectionLabel>Dialog</SectionLabel>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. It provides context about the
                dialog content.
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm">
              Dialog body content goes here. This can contain any elements.
            </p>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dropdown Menu */}
      <div className="space-y-6">
        <SectionLabel>Dropdown Menu</SectionLabel>
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Menu <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Checkboxes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={checkboxOne}
                onCheckedChange={setCheckboxOne}
              >
                Show projects
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={checkboxTwo}
                onCheckedChange={setCheckboxTwo}
              >
                Show interviews
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Radio Group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                onValueChange={setRadioValue}
                value={radioValue}
              >
                <DropdownMenuRadioItem value="option-1">
                  Option One
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="option-2">
                  Option Two
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="option-3">
                  Option Three
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sheet */}
      <div className="space-y-6">
        <SectionLabel>Sheet</SectionLabel>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>
                This is a sheet panel that slides in from the right.
              </SheetDescription>
            </SheetHeader>
            <div className="p-6">
              <p className="text-sm">
                Sheet body content. Useful for filters, settings, or secondary
                navigation.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
