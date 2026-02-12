"use client";

import { EditIcon, ImageIcon, LinkIcon, PlayIcon } from "@sanity/icons";
import { Box, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useMemo, useState } from "react";
import { ObjectInputMember, type ObjectInputProps } from "sanity";
import SanityImage from "@/components/modules/shared/sanity-image";

type MediaPosition = "left" | "center" | "right" | null;

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

interface ThreeSideBySideValue {
  _type?: string;
  left?: MediaItemValue;
  center?: MediaItemValue;
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
}: {
  media: MediaItemValue | undefined;
  label: string;
  onClick: () => void;
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

export function ThreeSideBySideInput(props: ObjectInputProps) {
  const {
    value,
    members,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
  } = props;
  const [expandedPosition, setExpandedPosition] = useState<MediaPosition>(null);

  const typedValue = value as ThreeSideBySideValue | undefined;

  const handleClose = useCallback(() => {
    setExpandedPosition(null);
  }, []);

  const leftMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "left"),
    [members]
  );

  const centerMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "center"),
    [members]
  );

  const rightMember = useMemo(
    () => members.find((m) => m.kind === "field" && m.name === "right"),
    [members]
  );

  const expandedMember = useMemo(() => {
    switch (expandedPosition) {
      case "left":
        return leftMember;
      case "center":
        return centerMember;
      case "right":
        return rightMember;
      default:
        return undefined;
    }
  }, [expandedPosition, leftMember, centerMember, rightMember]);

  const positionLabel = useMemo(() => {
    switch (expandedPosition) {
      case "left":
        return "Left";
      case "center":
        return "Center";
      case "right":
        return "Right";
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
      <Flex gap={3}>
        <MediaThumbnail
          label="Left"
          media={typedValue?.left}
          onClick={() => setExpandedPosition("left")}
        />
        <MediaThumbnail
          label="Center"
          media={typedValue?.center}
          onClick={() => setExpandedPosition("center")}
        />
        <MediaThumbnail
          label="Right"
          media={typedValue?.right}
          onClick={() => setExpandedPosition("right")}
        />
      </Flex>

      {expandedPosition && expandedMember && (
        <Dialog
          header={`Edit ${positionLabel} Media`}
          id={`three-side-by-side-dialog-${expandedPosition}`}
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
