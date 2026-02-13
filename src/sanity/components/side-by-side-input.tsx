"use client";

import { EditIcon, ImageIcon, LinkIcon, PlayIcon } from "@sanity/icons";
import { Box, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useMemo, useState } from "react";
import { ObjectInputMember, type ObjectInputProps } from "sanity";
import SanityImage from "@/components/modules/shared/sanity-image";

type MediaSide = "left" | "right" | null;

interface MediaItemValue {
  _type?: string;
  type?: "image" | "videoUpload" | "videoEmbed";
  image?: {
    _type?: string;
    asset?: {
      _ref?: string;
    };
  };
  caption?: string;
}

interface SideBySideValue {
  _type?: string;
  orientation?: string;
  left?: MediaItemValue;
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
        flex: 1,
        cursor: "pointer",
        border: hasMedia ? undefined : "2px dashed var(--card-border-color)",
        minHeight: 120,
        position: "relative",
        overflow: "hidden",
      }}
      tone={hasMedia ? "default" : "transparent"}
      type="button"
    >
      <Stack space={2}>
        {/* Thumbnail preview */}
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
    <Stack space={4}>
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
