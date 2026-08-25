"use client";

import { Card, Stack, Text } from "@sanity/ui";
import { useCallback } from "react";
import {
  type NumberInputProps,
  set,
  unset,
  useClient,
  useFormValue,
} from "sanity";
import { apiVersion } from "@/sanity/env";
import { ensureDraft } from "./ensure-draft";

const MS_PER_DAY = 86_400_000;
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Compute YYYY-MM-DD from a base YYYY-MM-DD plus N days, in UTC.
 * Sanity stores `date` types as YYYY-MM-DD strings; we treat them as
 * calendar dates and add literal days, not calendar months.
 */
function addDays(baseIso: string, days: number): string | null {
  // Parse YYYY-MM-DD as UTC midnight to avoid TZ rollover.
  const match = ISO_DATE_REGEX.exec(baseIso);
  if (!match) {
    return null;
  }
  const [, y, m, d] = match;
  const base = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (Number.isNaN(base.getTime())) {
    return null;
  }
  const next = new Date(base.getTime() + days * MS_PER_DAY);
  const ny = next.getUTCFullYear();
  const nm = String(next.getUTCMonth() + 1).padStart(2, "0");
  const nd = String(next.getUTCDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}

/**
 * Custom input for the `duration` field on the `adv` document.
 * On change, it emits the duration patch and ALSO patches the sibling
 * `dateEnd` field to `dateStart + duration` days. The editor can still
 * manually override `dateEnd` after the fact.
 */
export function DurationInput(props: NumberInputProps) {
  const { onChange, value, elementProps, schemaType } = props;
  const dateStart = useFormValue(["dateStart"]) as string | undefined;
  const documentId = useFormValue(["_id"]) as string | undefined;
  const documentType = useFormValue(["_type"]) as string | undefined;
  const client = useClient({ apiVersion });

  const optionsList = (
    schemaType.options as { list?: Array<{ title: string; value: number }> }
  )?.list;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const raw = event.currentTarget.value;
      const parsed = raw === "" ? Number.NaN : Number(raw);

      if (!Number.isFinite(parsed) || parsed <= 0) {
        onChange(unset());
        return;
      }

      onChange(set(parsed));

      if (!(dateStart && documentId)) {
        return;
      }

      const nextEnd = addDays(dateStart, parsed);
      if (!nextEnd) {
        return;
      }

      // Use the shared ensureDraft helper so the patch lands on a real draft —
      // works on brand-new documents (where neither published nor draft exist
      // yet) as well as existing ones being edited.
      ensureDraft(client, documentId, documentType)
        .then((draftId) =>
          client.patch(draftId).set({ dateEnd: nextEnd }).commit()
        )
        .catch(() => {
          // Non-fatal: editor can still set dateEnd manually.
        });
    },
    [client, dateStart, documentId, documentType, onChange]
  );

  return (
    <Stack gap={2}>
      <select
        {...elementProps}
        onChange={handleChange}
        style={{
          padding: "0.5rem",
          borderRadius: "0.25rem",
          border: "1px solid var(--card-border-color)",
          background: "var(--card-bg-color)",
          color: "var(--card-fg-color)",
          fontSize: "0.9375rem",
        }}
        value={value ?? ""}
      >
        <option disabled value="">
          Select duration
        </option>
        {optionsList?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </select>
      {dateStart ? (
        <Card padding={2} radius={2} tone="transparent">
          <Text muted size={1}>
            End date will be auto-set to {addDays(dateStart, value ?? 0) ?? "—"}
            . You can override it manually below.
          </Text>
        </Card>
      ) : (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>
            Set the start date first to auto-fill the end date.
          </Text>
        </Card>
      )}
    </Stack>
  );
}
