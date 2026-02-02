"use client";

import { LinkIcon, PlayIcon, ImageIcon, EditIcon } from "@sanity/icons";
import { Box, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import { useState, useCallback, useMemo } from "react";
import { ObjectInputMember, type ObjectInputProps } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

type GridPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | null;

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

type GridFourValue = {
  _type?: string;
  topLeft?: MediaItemValue;
  topRight?: MediaItemValue;
  bottomLeft?: MediaItemValue;
  bottomRight?: MediaItemValue;
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
        minHeight: 100,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack space={2}>
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

export function GridFourInput(props: ObjectInputProps) {
  const { value, members, renderField, renderInput, renderItem, renderPreview } =
    props;
  const [expandedPosition, setExpandedPosition] = useState<GridPosition>(null);

  const typedValue = value as GridFourValue | undefined;

  const handleClose = useCallback(() => {
    setExpandedPosition(null);
  }, []);

  const topLeftMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "topLeft"),
    [members]
  );

  const topRightMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "topRight"),
    [members]
  );

  const bottomLeftMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "bottomLeft"),
    [members]
  );

  const bottomRightMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "bottomRight"),
    [members]
  );

  const expandedMember = useMemo(() => {
    switch (expandedPosition) {
      case "topLeft":
        return topLeftMember;
      case "topRight":
        return topRightMember;
      case "bottomLeft":
        return bottomLeftMember;
      case "bottomRight":
        return bottomRightMember;
      default:
        return undefined;
    }
  }, [expandedPosition, topLeftMember, topRightMember, bottomLeftMember, bottomRightMember]);

  const positionLabel = useMemo(() => {
    switch (expandedPosition) {
      case "topLeft":
        return "Top Left";
      case "topRight":
        return "Top Right";
      case "bottomLeft":
        return "Bottom Left";
      case "bottomRight":
        return "Bottom Right";
      default:
        return "";
    }
  }, [expandedPosition]);

  const renderProps = {
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  };

  return (
    <Stack space={4}>
      <Stack space={3}>
        {/* Top row */}
        <Flex gap={3}>
          <MediaThumbnail
            media={typedValue?.topLeft}
            label="Top Left"
            onClick={() => setExpandedPosition("topLeft")}
          />
          <MediaThumbnail
            media={typedValue?.topRight}
            label="Top Right"
            onClick={() => setExpandedPosition("topRight")}
          />
        </Flex>

        {/* Bottom row */}
        <Flex gap={3}>
          <MediaThumbnail
            media={typedValue?.bottomLeft}
            label="Bottom Left"
            onClick={() => setExpandedPosition("bottomLeft")}
          />
          <MediaThumbnail
            media={typedValue?.bottomRight}
            label="Bottom Right"
            onClick={() => setExpandedPosition("bottomRight")}
          />
        </Flex>
      </Stack>

      {expandedPosition && expandedMember && (
        <Dialog
          header={`Edit ${positionLabel} Media`}
          id={`grid-four-dialog-${expandedPosition}`}
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
