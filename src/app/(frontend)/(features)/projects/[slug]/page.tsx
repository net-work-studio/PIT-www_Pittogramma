import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectInfo from "@/components/modules/project/project-info";
import DiscoverMore from "@/components/modules/shared/discover-more";
import SanityImage from "@/components/modules/shared/sanity-image";
import { JsonLd } from "@/components/seo/JsonLd";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { slug },
  });

  if (!project) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: project.title,
      description: project.description ?? undefined,
      coverImage: project.cover?.image,
      seo: project.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: `/projects/${slug}`,
    siteDefaults,
  });
}

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

  if (!project) {
    notFound();
  }

  const imageUrl = project.cover?.image
    ? urlForImage(project.cover.image)?.url()
    : undefined;

  return (
    <>
      <JsonLd
        data={{
          name: project.title,
          description: project.description,
          creator: project.designer?.name
            ? {
                "@type": "Person",
                name: project.designer.name,
              }
            : undefined,
          dateCreated: project.year ? String(project.year) : undefined,
          image: imageUrl,
          url: `${siteDefaults.baseUrl}/projects/${slug}`,
        }}
        type="CreativeWork"
      />
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
