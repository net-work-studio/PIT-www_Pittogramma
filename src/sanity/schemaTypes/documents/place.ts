import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { PlaceInput } from "@/sanity/components/place-input";

export const place = defineType({
  type: "document",
  name: "place",
  title: "Place",
  icon: PinIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      description: "Display name, e.g. Milan, Italy",
      validation: (e) => e.required(),
      components: {
        input: PlaceInput,
      },
    }),
    defineField({
      type: "string",
      name: "city",
      title: "City",
      readOnly: true,
    }),
    defineField({
      type: "string",
      name: "country",
      title: "Country",
      readOnly: true,
    }),
    defineField({
      type: "string",
      name: "countryCode",
      title: "Country Code",
      description: "2-letter ISO country code",
      readOnly: true,
    }),
    defineField({
      type: "string",
      name: "state",
      title: "State / Region",
      readOnly: true,
    }),
    defineField({
      type: "number",
      name: "lat",
      title: "Latitude",
      readOnly: true,
    }),
    defineField({
      type: "number",
      name: "lng",
      title: "Longitude",
      readOnly: true,
    }),
    defineField({
      type: "number",
      name: "osmId",
      title: "OpenStreetMap ID",
      readOnly: true,
    }),
    defineField({
      type: "string",
      name: "osmType",
      title: "OSM Type",
      readOnly: true,
    }),
    defineField({
      type: "string",
      name: "formattedAddress",
      title: "Formatted Address",
      description: "Full display name from Nominatim",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      city: "city",
      country: "country",
    },
    prepare({ title, city, country }) {
      const parts = [city, country].filter(Boolean);
      return {
        title: title || "Untitled Place",
        subtitle: parts.join(", "),
      };
    },
  },
});
