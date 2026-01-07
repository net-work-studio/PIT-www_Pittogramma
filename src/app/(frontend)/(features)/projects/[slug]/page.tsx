import ProjectInfo from "@/components/modules/project/project-info";
import DiscoverMore from "@/components/modules/shared/discover-more";
import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
  });

  return (
    <>
      <div className="flex pt-16">
        <ProjectInfo
          description={project?.description}
          designer={project?.designer?.name}
          institute={project?.institute?.name}
          tags={project?.tags}
          teacher={project?.teacher?.name}
          title={project?.title}
          year={project?.year}
        />
        <div className="w-2/3">
          <div>
            <AspectRatio className="relative w-full" ratio={4 / 3}>
              <SanityImage
                className="w-full rounded-lg object-cover"
                fill
                source={project?.cover}
              />
            </AspectRatio>
          </div>
          <div className="mx-auto px-60 py-10 text-lg">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor
            sit amet consectetur adipiscing elit. Quisque faucibus ex sapien
            vitae pellentesque sem placerat. In id cursus mi pretium tellus duis
            convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar
            vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
            nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel
            class aptent taciti sociosqu. Ad litora torquent per conubia nostra
            inceptos himenaeos. Lorem ipsum dolor sit amet consectetur
            adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo
            eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
            metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer
            nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu.
            Ad litora torquent per conubia nostra inceptos himenaeos. Lorem
            ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
            ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
            tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
            Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
            massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
            semper vel class aptent taciti sociosqu. Ad litora torquent per
            conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet
            consectetur adipiscing elit. Quisque faucibus ex sapien vitae
            pellentesque sem placerat. In id cursus mi pretium tellus duis
            convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar
            vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
            nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel
            class aptent taciti sociosqu. Ad litora torquent per conubia nostra
            inceptos himenaeos.
          </div>
        </div>
      </div>
      <DiscoverMore />
    </>
  );
}
