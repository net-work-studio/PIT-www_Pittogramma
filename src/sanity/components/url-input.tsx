"use client";

import {
  Button,
  Card,
  Flex,
  Stack,
  Text,
  TextInput,
  useToast,
} from "@sanity/ui";
import { useCallback, useState } from "react";
import {
  type StringInputProps,
  set,
  unset,
  useClient,
  useFormValue,
} from "sanity";
import { apiVersion } from "@/sanity/env";

type OgData = {
  title: string | null;
  description: string | null;
  siteName: string | null;
  imageUrl: string | null;
};

function buildPatchData(data: OgData): Record<string, unknown> {
  const patchData: Record<string, unknown> = {};

  // Use siteName as name, fallback to title
  if (data.siteName) {
    patchData.name = data.siteName;
  } else if (data.title) {
    patchData.name = data.title;
  }

  if (data.description) {
    patchData.description = data.description;
  }

  // Store raw OG values for reference
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

export function UrlInput(props: StringInputProps) {
  const { onChange, value = "", elementProps } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<OgData | null>(null);
  const [isPatching, setIsPatching] = useState(false);

  // Get the document form context to patch other fields
  const documentId = useFormValue(["_id"]) as string | undefined;
  const client = useClient({ apiVersion });
  const toast = useToast();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
      // Clear previous fetch results when URL changes
      setFetchedData(null);
      setError(null);
    },
    [onChange]
  );

  const uploadCoverImage = useCallback(
    async (
      imageUrl: string,
      siteName: string | null
    ): Promise<Record<string, unknown> | null> => {
      const imageResponse = await fetch(
        `/api/websites/fetch-image?url=${encodeURIComponent(imageUrl)}`
      );

      if (!imageResponse.ok) {
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
    [client]
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

        const patchId = documentId.startsWith("drafts.")
          ? documentId
          : `drafts.${documentId}`;
        await client.patch(patchId).set(patchData).commit();

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

  const handleFetch = useCallback(async () => {
    if (!value) {
      setError("Please enter a URL first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFetchedData(null);

    try {
      const response = await fetch(
        `/api/websites/fetch-og?url=${encodeURIComponent(value)}`,
        { signal: AbortSignal.timeout(15_000) }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch website data");
      }

      setFetchedData(data);

      // Automatically patch the document fields
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
  }, [value, patchDocumentFields]);

  return (
    <Stack space={3} style={{ width: "100%" }}>
      <Flex align="center" gap={2} style={{ width: "100%" }}>
        <TextInput
          {...elementProps}
          onChange={handleChange}
          placeholder="Enter website URL (https://...)"
          style={{ flex: 1 }}
          value={value}
        />
        <Button
          disabled={isLoading || isPatching || !value}
          mode="ghost"
          onClick={handleFetch}
          text={getButtonText(isLoading, isPatching)}
          tone="primary"
        />
      </Flex>
      <Text muted size={1}>
        Limited to 10 requests per minute
      </Text>

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
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
