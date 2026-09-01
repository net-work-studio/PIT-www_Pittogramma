import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";
import { PlaceInput } from "@/sanity/components/place-input";

export const place = defineType({
  fields: [
    defineField({
      components: {
        input: PlaceInput,
      },
      description: "Display name, e.g. Milan, Italy",
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "city",
      readOnly: true,
      title: "City",
      type: "string",
    }),
    defineField({
      name: "country",
      readOnly: true,
      title: "Country",
      type: "string",
    }),
    defineField({
      description: "2-letter ISO country code",
      name: "countryCode",
      readOnly: true,
      title: "Country Code",
      type: "string",
    }),
    defineField({
      name: "state",
      readOnly: true,
      title: "State / Region",
      type: "string",
    }),
    defineField({
      name: "lat",
      readOnly: true,
      title: "Latitude",
      type: "number",
    }),
    defineField({
      name: "lng",
      readOnly: true,
      title: "Longitude",
      type: "number",
    }),
    defineField({
      name: "osmId",
      readOnly: true,
      title: "OpenStreetMap ID",
      type: "number",
    }),
    defineField({
      name: "osmType",
      readOnly: true,
      title: "OSM Type",
      type: "string",
    }),
    defineField({
      description: "Full display name from Nominatim",
      name: "formattedAddress",
      readOnly: true,
      title: "Formatted Address",
      type: "string",
    }),
  ],
  icon: PinIcon,
  name: "place",
  preview: {
    prepare({ title, city, country }) {
      const parts = [city, country].filter(Boolean);
      return {
        subtitle: parts.join(", "),
        title: title || "Untitled Place",
      };
    },
    select: {
      city: "city",
      country: "country",
      title: "name",
    },
  },
  title: "Place",
  type: "document",
});
