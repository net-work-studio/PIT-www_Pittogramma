"use client";

import { EditIcon } from "@sanity/icons/Edit";
import { ImageIcon } from "@sanity/icons/Image";
import { LinkIcon } from "@sanity/icons/Link";
import { PlayIcon } from "@sanity/icons/Play";
import { Box, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useMemo, useState } from "react";
import { ObjectInputMember, type ObjectInputProps } from "sanity";
import SanityImage from "@/components/modules/shared/sanity-image";

type MediaSide = "left" | "right" | null;

interface MediaItemValue {
  _type?: string;
  caption?: string;
  image?: {
    _type?: string;
    asset?: {
      _ref?: string;
    };
  };
  type?: "image" | "videoUpload" | "videoEmbed";
}

interface SideBySideValue {
  _type?: string;
  left?: MediaItemValue;
  orientation?: string;
  right?: MediaItemValue;
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
        border: hasMedia ? undefined : "2px dashed var(--card-border-color)",
        cursor: "pointer",
        flex: 1,
        minHeight: 120,
        overflow: "hidden",
        position: "relative",
      }}
      tone={hasMedia ? "default" : "transparent"}
      type="button"
    >
      <Stack gap={2}>
        {/* Thumbnail preview */}
        <Box
          style={{
            alignItems: "center",
            aspectRatio,
            backgroundColor: "var(--card-muted-bg-color)",
            borderRadius: 4,
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
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

        {/* Label and caption */}
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

export function SideBySideInput(props: ObjectInputProps) {
  const {
    value,
    members,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  } = props;
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

  const orientationMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "orientation"),
    [members]
  );

  const expandedMember = expandedSide === "left" ? leftMember : rightMember;

  const aspectRatio = typedValue?.orientation === "portrait" ? "3/4" : "4/3";

  // Render props for ObjectInputMember
  const renderProps = {
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  };

  return (
    <Stack gap={4}>
      {/* Orientation selector */}
      {orientationMember && (
        <ObjectInputMember member={orientationMember} {...renderProps} />
      )}

      {/* Side-by-side thumbnails */}
      <Flex gap={3}>
        <MediaThumbnail
          aspectRatio={aspectRatio}
          label="Left"
          media={typedValue?.left}
          onClick={() => setExpandedSide("left")}
        />
        <MediaThumbnail
          aspectRatio={aspectRatio}
          label="Right"
          media={typedValue?.right}
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
