"use client";

import {
  Button,
  Card,
  Flex,
  Stack,
  Text,
  TextInput,
  useToast,
} from "@sanity/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type StringInputProps,
  set,
  unset,
  useClient,
  useFormValue,
} from "sanity";
import { apiVersion } from "@/sanity/env";

interface NominatimResult {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
    state?: string;
  };
  display_name: string;
  lat: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
}

export function PlaceInput(props: StringInputProps) {
  const { onChange, value = "", elementProps } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const documentId = useFormValue(["_id"]) as string | undefined;
  const client = useClient({ apiVersion });
  const toast = useToast();

  // Read current field values to show confirmation
  const currentCity = useFormValue(["city"]) as string | undefined;
  const currentCountry = useFormValue(["country"]) as string | undefined;
  const currentLat = useFormValue(["lat"]) as number | undefined;
  const currentLng = useFormValue(["lng"]) as number | undefined;

  const searchPlaces = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/places/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search on query change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchPlaces(searchQuery);
      }, 300);
    } else {
      setResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, searchPlaces]);

  const handleSelect = useCallback(
    async (result: NominatimResult) => {
      setShowDropdown(false);
      setSearchQuery("");

      if (!documentId) {
        setError("Please save the document first before selecting a place.");
        return;
      }

      setIsPatching(true);

      try {
        const addr = result.address;
        const city =
          addr.city || addr.town || addr.village || addr.municipality || "";
        const country = addr.country || "";
        const displayName =
          city && country
            ? `${city}, ${country}`
            : result.display_name.split(",").slice(0, 2).join(",").trim();

        // Set the name field via the form
        onChange(set(displayName));

        // Patch remaining fields directly on the document
        const patchId = documentId.startsWith("drafts.")
          ? documentId
          : `drafts.${documentId}`;

        await client
          .patch(patchId)
          .set({
            city,
            country,
            countryCode: addr.country_code?.toUpperCase() || "",
            state: addr.state || "",
            lat: Number.parseFloat(result.lat),
            lng: Number.parseFloat(result.lon),
            osmId: result.osm_id,
            osmType: result.osm_type,
            formattedAddress: result.display_name,
          })
          .commit();

        toast.push({
          status: "success",
          title: "Place populated",
          description: `Selected: ${displayName}`,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update place fields"
        );
      } finally {
        setIsPatching(false);
      }
    },
    [documentId, client, toast, onChange]
  );

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <Stack space={3}>
      {/* Name field (editable) */}
      <TextInput {...elementProps} onChange={handleNameChange} value={value} />

      {/* Search bar */}
      <Flex align="center" gap={2}>
        <div style={{ flex: 1, position: "relative" }}>
          <TextInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.currentTarget.value)
            }
            placeholder="Search for a place (e.g. Milan, Tokyo, Berlin)..."
            value={searchQuery}
          />

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <Card
              radius={2}
              shadow={2}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 100,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <Stack padding={1} space={1}>
                {results.map((result: NominatimResult) => (
                  <Button
                    key={result.place_id}
                    mode="bleed"
                    onClick={() => handleSelect(result)}
                    style={{
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <Text size={1} textOverflow="ellipsis">
                      {result.display_name}
                    </Text>
                  </Button>
                ))}
              </Stack>
            </Card>
          )}
        </div>
      </Flex>

      {isSearching && (
        <Text muted size={1}>
          Searching...
        </Text>
      )}

      {isPatching && (
        <Card padding={3} radius={2} tone="primary">
          <Text size={1}>Populating place fields...</Text>
        </Card>
      )}

      {error && (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {/* Show populated data summary */}
      {currentCity && currentCountry && !isPatching && (
        <Card border padding={3} radius={2} tone="positive">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Place data:
            </Text>
            <Text size={1}>
              <strong>City:</strong> {currentCity}
            </Text>
            <Text size={1}>
              <strong>Country:</strong> {currentCountry}
            </Text>
            {currentLat != null && currentLng != null && (
              <Text size={1}>
                <strong>Coordinates:</strong> {currentLat}, {currentLng}
              </Text>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
