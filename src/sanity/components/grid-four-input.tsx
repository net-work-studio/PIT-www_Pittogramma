"use client";

import { EditIcon, ImageIcon, LinkIcon, PlayIcon } from "@sanity/icons";
import { Box, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useMemo, useState } from "react";
import { ObjectInputMember, type ObjectInputProps } from "sanity";
import SanityImage from "@/components/modules/shared/sanity-image";

type GridPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | null;

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
  orientation?: string;
  topLeft?: MediaItemValue;
  topRight?: MediaItemValue;
  bottomLeft?: MediaItemValue;
  bottomRight?: MediaItemValue;
};

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
  aspectRatio = "4/3",
}: {
  media: MediaItemValue | undefined;
  label: string;
  onClick: () => void;
  aspectRatio?: string;
}) {
  const hasImage = !!media?.image?.asset?._ref;
  const Icon = getMediaIcon(media?.type);
  const hasMedia = media?.type;

  return (
    <Card
      as="button"
      onClick={onClick}
      padding={3}
      radius={2}
      shadow={1}
      style={{
        flex: 1,
        cursor: "pointer",
        border: hasMedia ? undefined : "2px dashed var(--card-border-color)",
        minHeight: 100,
        position: "relative",
        overflow: "hidden",
      }}
      tone={hasMedia ? "default" : "transparent"}
      type="button"
    >
      <Stack space={2}>
        <Box
          style={{
            aspectRatio,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "var(--card-muted-bg-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasImage ? (
            <SanityImage
              alt={media?.caption || label}
              height={150}
              source={media}
              width={200}
            />
          ) : (
            <Text muted size={4}>
              <Icon />
            </Text>
          )}
        </Box>

        <Flex align="center" gap={2}>
          <Text muted size={1} weight="semibold">
            {label}
          </Text>
          <Text muted size={0}>
            <EditIcon />
          </Text>
        </Flex>

        {media?.caption && (
          <Text muted size={1}>
            {media.caption}
          </Text>
        )}

        {!hasMedia && (
          <Text muted size={1}>
            Click to add media
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export function GridFourInput(props: ObjectInputProps) {
  const {
    value,
    members,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  } = props;
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

  const orientationMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "orientation"),
    [members]
  );

  const aspectRatio = typedValue?.orientation === "portrait" ? "3/4" : "4/3";

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
  }, [
    expandedPosition,
    topLeftMember,
    topRightMember,
    bottomLeftMember,
    bottomRightMember,
  ]);

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
      {/* Orientation selector */}
      {orientationMember && (
        <ObjectInputMember member={orientationMember} {...renderProps} />
      )}

      <Stack space={3}>
        {/* Top row */}
        <Flex gap={3}>
          <MediaThumbnail
            aspectRatio={aspectRatio}
            label="Top Left"
            media={typedValue?.topLeft}
            onClick={() => setExpandedPosition("topLeft")}
          />
          <MediaThumbnail
            aspectRatio={aspectRatio}
            label="Top Right"
            media={typedValue?.topRight}
            onClick={() => setExpandedPosition("topRight")}
          />
        </Flex>

        {/* Bottom row */}
        <Flex gap={3}>
          <MediaThumbnail
            aspectRatio={aspectRatio}
            label="Bottom Left"
            media={typedValue?.bottomLeft}
            onClick={() => setExpandedPosition("bottomLeft")}
          />
          <MediaThumbnail
            aspectRatio={aspectRatio}
            label="Bottom Right"
            media={typedValue?.bottomRight}
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
