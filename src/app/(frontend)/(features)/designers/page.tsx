import { Search } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Filter from "@/components/feat/filter/filter";
import SubmitProjectBanner from "@/components/feat/submit/submit-project-banner";
import PageHeader from "@/components/shared/page-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { sampleDesignersData } from "@/sample-data/sample-designers-data";

export const metadata: Metadata = {
  title: "Designers",
  description:
    "The complete list of young graphic designers who have a project published on the platform",
};

function DesignerCard() {
  return (
    <div className="flex flex-col gap-1">
      <AspectRatio className="relative" ratio={4 / 3}>
        <Image
          alt="Designer Card"
          className="rounded-lg bg-gray-600"
          fill
          src="https://placehold.co/400x300/png"
        />
      </AspectRatio>
      <ul className="flex justify-between">
        <li className="col-span-6">Name Designer</li>
        <li className="col-span-2">City, Country</li>
      </ul>
    </div>
  );
}

export default function DesignersPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="The complete list of young graphic designers who have a project published on the platform"
          title="Designers"
        />
      </div>
      <div className="space-y-5 pt-30">
        <div className="flex justify-between">
          <Filter />
          <Search />
        </div>
        <section className="grid grid-cols-4 gap-2.5">
          {sampleDesignersData.map((_, index) => (
            <DesignerCard key={index} />
          ))}
        </section>
        <SubmitProjectBanner />
      </div>
    </>
  );
}
