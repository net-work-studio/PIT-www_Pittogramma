"use client";

import { LinkIcon, PlayIcon, ImageIcon, EditIcon } from "@sanity/icons";
import { Box, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import { useState, useCallback, useMemo } from "react";
import { ObjectInputMember, type ObjectInputProps } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

type MediaSide = "left" | "right" | null;

type MediaItemValue = {
  _type?: string;
  type?: "image" | "videoUpload" | "videoEmbed";
  image?: {
    _type?: string;
    asset?: {
      _ref?: string;
    };
  };
  caption?: string;
};

type SideBySideValue = {
  _type?: string;
  left?: MediaItemValue;
  right?: MediaItemValue;
};

const builder = imageUrlBuilder({ projectId, dataset });

function getImageUrl(media: MediaItemValue | undefined): string | null {
  if (!media?.image?.asset?._ref) return null;
  return builder.image(media.image).width(200).height(150).fit("crop").url();
}

function getMediaIcon(type: string | undefined) {
  switch (type) {
    case "videoUpload":
      return PlayIcon;
    case "videoEmbed":
      return LinkIcon;
    default:
      return ImageIcon;
  }
}

function MediaThumbnail({
  media,
  label,
  onClick,
}: {
  media: MediaItemValue | undefined;
  label: string;
  onClick: () => void;
}) {
  const imageUrl = getImageUrl(media);
  const Icon = getMediaIcon(media?.type);
  const hasMedia = media?.type;

  return (
    <Card
      as="button"
      type="button"
      onClick={onClick}
      padding={3}
      radius={2}
      shadow={1}
      tone={hasMedia ? "default" : "transparent"}
      style={{
        flex: 1,
        cursor: "pointer",
        border: hasMedia ? undefined : "2px dashed var(--card-border-color)",
        minHeight: 120,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack space={2}>
        {/* Thumbnail preview */}
        <Box
          style={{
            aspectRatio: "4/3",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "var(--card-muted-bg-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={media?.caption || label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Text size={4} muted>
              <Icon />
            </Text>
          )}
        </Box>

        {/* Label and caption */}
        <Flex align="center" gap={2}>
          <Text size={1} weight="semibold" muted>
            {label}
          </Text>
          <Text size={0} muted>
            <EditIcon />
          </Text>
        </Flex>

        {media?.caption && (
          <Text size={1} muted>
            {media.caption}
          </Text>
        )}

        {!hasMedia && (
          <Text size={1} muted>
            Click to add media
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export function SideBySideInput(props: ObjectInputProps) {
  const { value, members, renderField, renderInput, renderItem, renderPreview } =
    props;
  const [expandedSide, setExpandedSide] = useState<MediaSide>(null);

  const typedValue = value as SideBySideValue | undefined;

  const handleClose = useCallback(() => {
    setExpandedSide(null);
  }, []);

  // Find the member for the expanded side
  const leftMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "left"),
    [members]
  );

  const rightMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "right"),
    [members]
  );

  const expandedMember = expandedSide === "left" ? leftMember : rightMember;

  // Render props for ObjectInputMember
  const renderProps = {
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  };

  return (
    <Stack space={4}>
      {/* Side-by-side thumbnails */}
      <Flex gap={3}>
        <MediaThumbnail
          media={typedValue?.left}
          label="Left"
          onClick={() => setExpandedSide("left")}
        />
        <MediaThumbnail
          media={typedValue?.right}
          label="Right"
          onClick={() => setExpandedSide("right")}
        />
      </Flex>

      {/* Edit dialog */}
      {expandedSide && expandedMember && (
        <Dialog
          header={`Edit ${expandedSide === "left" ? "Left" : "Right"} Media`}
          id={`side-by-side-dialog-${expandedSide}`}
          onClose={handleClose}
          width={1}
        >
          <Box padding={4}>
            <ObjectInputMember member={expandedMember} {...renderProps} />
          </Box>
        </Dialog>
      )}
    </Stack>
  );
}
