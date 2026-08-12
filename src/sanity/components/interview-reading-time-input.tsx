"use client";

import { Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useCallback, useState } from "react";
import { type NumberInputProps, set, unset, useFormValue } from "sanity";
import { calculateInterviewReadingTime } from "@/lib/interview-reading-time";

export function InterviewReadingTimeInput(props: NumberInputProps) {
  const { elementProps, onChange, value } = props;
  const [isEditingOverride, setIsEditingOverride] = useState(false);
  const introText = useFormValue(["introText"]);
  const interview = useFormValue(["interview"]);
  const calculatedReadingTime = calculateInterviewReadingTime({
    interview,
    introText,
  });
  const override = typeof value === "number" ? value : undefined;
  const hasOverride = override !== undefined;
  const showOverrideInput = hasOverride || isEditingOverride;

  const handleOverrideChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.currentTarget.value;
      if (rawValue === "") {
        onChange(unset());
        return;
      }

      const nextValue = Number(rawValue);
      if (!Number.isInteger(nextValue) || nextValue < 1) {
        return;
      }

      onChange(set(nextValue));
    },
    [onChange]
  );

  const resetOverride = useCallback(() => {
    onChange(unset());
    setIsEditingOverride(false);
  }, [onChange]);

  const startOverride = useCallback(() => {
    setIsEditingOverride(true);
  }, []);

  const cancelOverride = useCallback(() => {
    setIsEditingOverride(false);
  }, []);

  let readingTimeLabel = "Add readable interview content";
  if (hasOverride) {
    readingTimeLabel = `${override} min`;
  } else if (calculatedReadingTime) {
    readingTimeLabel = `${calculatedReadingTime} min`;
  }

  let overrideAction = (
    <Button fontSize={0} mode="ghost" onClick={startOverride} padding={2}>
      Override estimate
    </Button>
  );
  if (hasOverride) {
    overrideAction = (
      <Button
        fontSize={0}
        mode="ghost"
        onClick={resetOverride}
        padding={2}
        tone="critical"
      >
        Reset to calculated time
      </Button>
    );
  } else if (showOverrideInput) {
    overrideAction = (
      <Button fontSize={0} mode="ghost" onClick={cancelOverride} padding={2}>
        Cancel override
      </Button>
    );
  }

  return (
    <Stack gap={3}>
      <Card padding={2} radius={2} tone="transparent">
        <Flex align="center" justify="space-between">
          <Text size={1}>{readingTimeLabel}</Text>
          {overrideAction}
        </Flex>
      </Card>

      {showOverrideInput ? (
        <Stack gap={2}>
          <Text size={1} weight="medium">
            Override estimate (minutes)
          </Text>
          <TextInput
            {...elementProps}
            inputMode="numeric"
            min={1}
            onChange={handleOverrideChange}
            type="number"
            value={override ?? ""}
          />
        </Stack>
      ) : null}
    </Stack>
  );
}
