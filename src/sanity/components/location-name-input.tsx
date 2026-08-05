"use client";

import { Box, Flex, Text } from "@sanity/ui";
import type { StringInputProps } from "sanity";

export function LocationNameInput(props: StringInputProps) {
  return (
    <Flex align="center">
      <Box marginRight={3} paddingLeft={2}>
        <Text muted size={1}>
          at
        </Text>
      </Box>
      <Box flex={1}>{props.renderDefault(props)}</Box>
    </Flex>
  );
}
