import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

type LegalPageName =
  | "cookiePolicyPage"
  | "impressumPage"
  | "privacyPolicyPage"
  | "submissionTermsPage";

function legalPage(title: string, name: LegalPageName) {
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
        validation: (Rule) => Rule.required(),
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

export const cookiePolicyPage = legalPage("Cookie Policy", "cookiePolicyPage");
export const impressumPage = legalPage(
  "Legal Notice / Impressum",
  "impressumPage"
);
export const privacyPolicyPage = legalPage(
  "Privacy Policy",
  "privacyPolicyPage"
);
export const submissionTermsPage = legalPage(
  "Project Submission Terms",
  "submissionTermsPage"
);
