import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

function legalPage(title: string, name: "impressumPage" | "privacyPolicyPage") {
  return defineType({
    __experimental_omnisearch_visibility: false,
    fields: [
      defineField({
        group: "content",
        initialValue: title,
        name: "title",
        readOnly: true,
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        description: "Legal copy shown on the public page.",
        group: "content",
        name: "content",
        of: [defineArrayMember({ type: "block" })],
        title: "Content",
        type: "array",
      }),
      defineField({
        group: "seo",
        name: "seo",
        title: "SEO",
        type: "seoModule",
      }),
    ],
    groups,
    icon: InfoOutlineIcon,
    name,
    title,
    type: "document",
  });
}

export const impressumPage = legalPage("Impressum", "impressumPage");
export const privacyPolicyPage = legalPage(
  "Privacy Policy",
  "privacyPolicyPage"
);
