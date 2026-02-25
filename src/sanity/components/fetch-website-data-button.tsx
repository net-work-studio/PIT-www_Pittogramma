"use client";

import { Button, Card, Flex, Stack, Text, useToast } from "@sanity/ui";
import { useCallback, useState } from "react";
import {
  type SanityClient,
  type StringInputProps,
  useClient,
  useFormValue,
} from "sanity";
import { apiVersion } from "@/sanity/env";

const DRAFTS_PREFIX = /^drafts\./;
const HTTP_PREFIX = /^http:\/\//;

interface OgData {
  description: string | null;
  imageUrl: string | null;
  siteName: string | null;
  title: string | null;
}

interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

/** Ensure a draft document exists — Studio doesn't auto-create one for custom button actions. */
async function ensureDraft(
  client: SanityClient,
  documentId: string
): Promise<string> {
  const publishedId = documentId.replace(DRAFTS_PREFIX, "");
  const draftId = `drafts.${publishedId}`;

  const draft = await client.getDocument(draftId);
  if (!draft) {
    const published = await client.getDocument(publishedId);
    if (published) {
      await client.createIfNotExists({ ...published, _id: draftId });
    }
  }

  return draftId;
}

function buildPatchData(data: OgData): Record<string, unknown> {
  const patchData: Record<string, unknown> = {};

  if (data.description) {
    patchData.description = data.description;
  }
  if (data.title) {
    patchData.ogTitle = data.title;
  }
  if (data.description) {
    patchData.ogDescription = data.description;
  }
  if (data.siteName) {
    patchData.ogSiteName = data.siteName;
  }
  if (data.imageUrl) {
    patchData.ogImageUrl = data.imageUrl;
  }

  return patchData;
}

function getButtonText(isLoading: boolean, isPatching: boolean): string {
  if (isLoading) {
    return "Fetching...";
  }
  if (isPatching) {
    return "Populating...";
  }
  return "Fetch Data";
}

export function FetchWebsiteDataButton(_props: StringInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<OgData | null>(null);
  const [isPatching, setIsPatching] = useState(false);

  const documentId = useFormValue(["_id"]) as string | undefined;
  const socialLinksLinks = useFormValue(["socialLinks", "links"]) as
    | SocialLink[]
    | undefined;
  const client = useClient({ apiVersion });
  const toast = useToast();

  const websiteLink = socialLinksLinks?.find(
    (link: SocialLink) => link.platform === "website"
  );
  const websiteUrl = websiteLink?.url;

  const uploadCoverImage = useCallback(
    async (
      imageUrl: string,
      siteName: string | null
    ): Promise<Record<string, unknown> | null> => {
      // Upgrade HTTP to HTTPS for the proxy (which requires HTTPS)
      const secureUrl = imageUrl.replace(HTTP_PREFIX, "https://");

      const imageResponse = await fetch(
        `/api/websites/fetch-image?url=${encodeURIComponent(secureUrl)}`,
        { signal: AbortSignal.timeout(15_000) }
      );

      if (!imageResponse.ok) {
        const body = await imageResponse.json().catch(() => null);
        const reason =
          (body as { error?: string } | null)?.error ??
          `HTTP ${imageResponse.status}`;
        toast.push({
          status: "warning",
          title: "Image upload skipped",
          description: reason,
        });
        return null;
      }

      const imageBlob = await imageResponse.blob();
      const imageAsset = await client.assets.upload("image", imageBlob, {
        filename: `cover-${siteName || "website"}.jpg`,
      });

      return {
        _type: "imageWithMetadata",
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        alt: siteName || "Website cover",
      };
    },
    [client, toast]
  );

  const patchDocumentFields = useCallback(
    async (data: OgData) => {
      if (!documentId) {
        setError(
          "Cannot patch: document ID not found. Please save the document first."
        );
        return;
      }

      setIsPatching(true);

      try {
        const patchData = buildPatchData(data);

        if (data.imageUrl) {
          const coverData = await uploadCoverImage(
            data.imageUrl,
            data.siteName
          );
          if (coverData) {
            patchData.cover = coverData;
          }
        }

        const draftId = await ensureDraft(client, documentId);
        await client.patch(draftId).set(patchData).commit();

        toast.push({
          status: "success",
          title: "Fields populated",
          description: "Website data has been auto-filled from OG tags.",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update document fields"
        );
      } finally {
        setIsPatching(false);
      }
    },
    [documentId, client, toast, uploadCoverImage]
  );

  const handleApplyName = useCallback(
    async (suggestedName: string) => {
      if (!documentId) {
        return;
      }
      try {
        const draftId = await ensureDraft(client, documentId);
        await client.patch(draftId).set({ name: suggestedName }).commit();
        toast.push({
          status: "success",
          title: "Name applied",
        });
      } catch {
        toast.push({
          status: "error",
          title: "Failed to apply name",
        });
      }
    },
    [documentId, client, toast]
  );

  const handleFetch = useCallback(async () => {
    if (!websiteUrl) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setFetchedData(null);

    try {
      const response = await fetch(
        `/api/websites/fetch-og?url=${encodeURIComponent(websiteUrl)}`,
        { signal: AbortSignal.timeout(15_000) }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch website data");
      }

      setFetchedData(data);
      await patchDocumentFields(data);
    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        setError("Request timed out. The website may be slow or unreachable.");
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [websiteUrl, patchDocumentFields]);

  return (
    <Stack space={3} style={{ width: "100%" }}>
      <Flex align="center" gap={2} style={{ width: "100%" }}>
        {websiteUrl ? (
          <>
            <Text size={1} style={{ flex: 1 }}>
              {websiteUrl}
            </Text>
            <Button
              disabled={isLoading || isPatching}
              mode="ghost"
              onClick={handleFetch}
              text={getButtonText(isLoading, isPatching)}
              tone="primary"
            />
          </>
        ) : (
          <Text muted size={1}>
            Add a Website link in Social Links first
          </Text>
        )}
      </Flex>

      {websiteUrl && (
        <Text muted size={1}>
          Limited to 10 requests per minute
        </Text>
      )}

      {error && (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {(isLoading || isPatching) && (
        <Card padding={3} radius={2} tone="primary">
          <Text size={1}>
            {isLoading
              ? "Fetching website data..."
              : "Updating document fields..."}
          </Text>
        </Card>
      )}

      {fetchedData && !isPatching && (
        <Card border padding={3} radius={2} tone="positive">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Fields auto-filled from OG tags:
            </Text>
            <Stack space={2}>
              {fetchedData.siteName && (
                <Text size={1}>
                  <strong>Site Name:</strong> {fetchedData.siteName}
                </Text>
              )}
              {fetchedData.title && (
                <Text size={1}>
                  <strong>Title:</strong> {fetchedData.title}
                </Text>
              )}
              {fetchedData.description && (
                <Text size={1}>
                  <strong>Description:</strong>{" "}
                  {fetchedData.description.substring(0, 200)}
                  {fetchedData.description.length > 200 ? "..." : ""}
                </Text>
              )}
              {fetchedData.imageUrl && (
                <Text size={1}>
                  <strong>Image:</strong> Found and uploaded
                </Text>
              )}
            </Stack>
            {(fetchedData.siteName || fetchedData.title) && (
              <Flex align="center" gap={2}>
                <Text muted size={1}>
                  Suggested name:{" "}
                  <strong>{fetchedData.siteName || fetchedData.title}</strong>
                </Text>
                <Button
                  fontSize={1}
                  mode="ghost"
                  onClick={() =>
                    handleApplyName(
                      (fetchedData.siteName || fetchedData.title) as string
                    )
                  }
                  padding={2}
                  text="Use as name"
                  tone="primary"
                />
              </Flex>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
