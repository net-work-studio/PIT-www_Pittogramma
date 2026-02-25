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

interface BookData {
  authors: string | null;
  categories: string[] | null;
  description: string | null;
  googleBooksId: string | null;
  language: string | null;
  pageCount: number | null;
  publisher: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  year: number | null;
}

function buildPatchData(data: BookData): Record<string, unknown> {
  const patchData: Record<string, unknown> = {};

  if (data.title) {
    patchData.name = data.title;
  }
  if (data.year) {
    patchData.year = data.year;
  }
  if (data.description) {
    patchData.description = data.description;
  }
  if (data.pageCount) {
    patchData.pageCount = data.pageCount;
  }
  if (data.categories && data.categories.length > 0) {
    patchData.categories = data.categories;
    patchData.fetchedCategories = data.categories.join(", ");
  }
  if (data.googleBooksId) {
    patchData.googleBooksId = data.googleBooksId;
  }
  if (data.authors) {
    patchData.fetchedAuthors = data.authors;
  }
  if (data.publisher) {
    patchData.fetchedPublisher = data.publisher;
  }
  if (data.language) {
    patchData.fetchedLanguages = data.language;
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

export function IsbnInput(props: StringInputProps) {
  const { onChange, value = "", elementProps } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<BookData | null>(null);
  const [isPatching, setIsPatching] = useState(false);

  // Get the document form context to patch other fields
  const documentId = useFormValue(["_id"]) as string | undefined;
  const client = useClient({ apiVersion });
  const toast = useToast();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
      // Clear previous fetch results when ISBN changes
      setFetchedData(null);
      setError(null);
    },
    [onChange]
  );

  const uploadCoverImage = useCallback(
    async (
      thumbnailUrl: string,
      title: string | null
    ): Promise<Record<string, unknown> | null> => {
      const imageResponse = await fetch(
        `/api/books/fetch-image?url=${encodeURIComponent(thumbnailUrl)}`
      );

      if (!imageResponse.ok) {
        return null;
      }

      const imageBlob = await imageResponse.blob();
      const imageAsset = await client.assets.upload("image", imageBlob, {
        filename: `cover-${value || "book"}.jpg`,
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
        alt: title || "Book cover",
      };
    },
    [client, value]
  );

  const patchDocumentFields = useCallback(
    async (data: BookData) => {
      if (!documentId) {
        setError(
          "Cannot patch: document ID not found. Please save the document first."
        );
        return;
      }

      setIsPatching(true);

      try {
        const patchData = buildPatchData(data);

        if (data.thumbnailUrl) {
          const coverData = await uploadCoverImage(
            data.thumbnailUrl,
            data.title
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
          description:
            "Book data has been auto-filled. Please link Authors and Publisher manually.",
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
      setError("Please enter an ISBN first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFetchedData(null);

    try {
      const response = await fetch(
        `/api/books/fetch-isbn?isbn=${encodeURIComponent(value)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch book data");
      }

      setFetchedData(data);

      // Automatically patch the document fields
      await patchDocumentFields(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [value, patchDocumentFields]);

  return (
    <Stack space={3}>
      <Flex align="center" gap={2}>
        <TextInput
          {...elementProps}
          onChange={handleChange}
          placeholder="Enter ISBN (10 or 13 digits)"
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
              ? "Fetching book data..."
              : "Updating document fields..."}
          </Text>
        </Card>
      )}

      {fetchedData && !isPatching && (
        <Card border padding={3} radius={2} tone="positive">
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Fields auto-filled from Google Books:
            </Text>
            <Stack space={2}>
              {fetchedData.title && (
                <Text size={1}>
                  <strong>Title:</strong> {fetchedData.title}
                </Text>
              )}
              {fetchedData.authors && (
                <Text size={1}>
                  <strong>Authors:</strong> {fetchedData.authors}
                </Text>
              )}
              {fetchedData.publisher && (
                <Text size={1}>
                  <strong>Publisher:</strong> {fetchedData.publisher}
                </Text>
              )}
              {fetchedData.year && (
                <Text size={1}>
                  <strong>Year:</strong> {fetchedData.year}
                </Text>
              )}
              {fetchedData.pageCount && (
                <Text size={1}>
                  <strong>Pages:</strong> {fetchedData.pageCount}
                </Text>
              )}
              {fetchedData.language && (
                <Text size={1}>
                  <strong>Language:</strong> {fetchedData.language}
                </Text>
              )}
              {fetchedData.categories && fetchedData.categories.length > 0 && (
                <Text size={1}>
                  <strong>Categories:</strong>{" "}
                  {fetchedData.categories.join(", ")}
                </Text>
              )}
              {fetchedData.description && (
                <Text size={1}>
                  <strong>Description:</strong>{" "}
                  {fetchedData.description.substring(0, 200)}...
                </Text>
              )}
            </Stack>
            <Card padding={2} radius={2} tone="caution">
              <Text size={1}>
                Please scroll down and link Authors and Publisher references
                manually.
              </Text>
            </Card>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
