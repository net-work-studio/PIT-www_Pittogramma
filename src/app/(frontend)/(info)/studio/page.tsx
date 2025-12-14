import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-blue-600 text-center text-white dark:bg-blue-700">
          studio page
        </div>
        <AspectRatio className="relative" ratio={4 / 3}>
          <Image
            alt="Studio"
            className="h-full w-full object-cover"
            fill
            src="https://placehold.co/400x300/png"
          />
        </AspectRatio>
      </div>
      <div>ad</div>
    </>
  );
}
