"use client";

import { Select } from "@sanity/ui";
import { useCallback } from "react";
import { type StringInputProps, set, useFormValue } from "sanity";

const CROP_OPTIONS = [
  { title: "Landscape (4:3)", value: "landscape" },
  { title: "Portrait (3:4)", value: "portrait" },
] as const;

const FREE_FORM_OPTION = {
  title: "Free Form (Original Proportions)",
  value: "freeform",
} as const;

/**
 * Shows Free form only for a Journal single-image block. All other blocks
 * retain the existing landscape and portrait choices.
 */
export function OrientationInput(props: StringInputProps) {
  const documentType = useFormValue(["_type"]);
  const mediaType = useFormValue([...props.path.slice(0, -1), "media", "type"]);
  const isJournalSingleImage =
    documentType === "journal" && mediaType === "image";
  const options = isJournalSingleImage
    ? [...CROP_OPTIONS, FREE_FORM_OPTION]
    : CROP_OPTIONS;
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      props.onChange(set(event.currentTarget.value)),
    [props.onChange]
  );

  return (
    <Select
      {...props.elementProps}
      disabled={props.readOnly}
      onChange={handleChange}
      value={props.value ?? "landscape"}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.title}
        </option>
      ))}
    </Select>
  );
}
