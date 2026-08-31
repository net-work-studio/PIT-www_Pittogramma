import { getCliClient } from "sanity/cli";

interface CtaWithLegacyImage {
  _id: string;
  image: {
    _type?: string;
    alt?: string;
    caption?: string;
    image?: unknown;
  };
}

async function migrate() {
  const client = getCliClient({
    apiVersion: "2026-06-03",
    dataset: "production",
    projectId: "jfvmcjyl",
  });
  const ctas = await client.fetch<CtaWithLegacyImage[]>(
    '*[_type == "cta" && defined(image.image.asset) && !defined(imgLight)]{_id, image}'
  );

  if (ctas.length === 0) {
    process.stdout.write("No CTA images need migration.\n");
    return;
  }

  await Promise.all(
    ctas.map(({ _id, image }) =>
      client.patch(_id).set({ imgLight: image }).unset(["image"]).commit()
    )
  );

  process.stdout.write(
    `Migrated ${ctas.length} CTA image${ctas.length === 1 ? "" : "s"}.\n`
  );
}

migrate();
