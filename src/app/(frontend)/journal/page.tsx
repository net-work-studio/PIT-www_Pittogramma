import Image from "next/image";
import PageHeader from "@/components/page-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Page() {
  return (
    <>
      <PageHeader title="Journal" />
      <section className="flex flex-row gap-2.5 bg-secondary">
        <div className="w-1/3">info</div>
        <AspectRatio className="relative h-full w-2/3" ratio={4 / 3}>
          <Image
            alt="Journal"
            className="h-full w-full object-cover"
            fill
            src="https://placehold.co/400x300/png"
          />
        </AspectRatio>
      </section>
      <section>grid</section>
    </>
  );
}
