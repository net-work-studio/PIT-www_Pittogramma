import BaseCard from "@/components/cards/base-card";

export default function DiscoverMore() {
  return (
    <div className="flex flex-col border-foreground border-t-[0.5px] pt-2.5">
      <h2 className="text-base">Discover More</h2>
      <div>
        <BaseCard
          href="/projects/project-1"
          image="https://placehold.co/600x400/png"
          title="Project Title"
        />
      </div>
    </div>
  );
}
