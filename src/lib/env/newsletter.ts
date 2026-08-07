export interface BrevoNewsletterConfig {
  apiKey: string;
  doiRedirectUrl: string;
  doiTemplateId: number;
  websiteListId: number;
}

export function getBrevoNewsletterConfig():
  | { configured: true; config: BrevoNewsletterConfig }
  | { configured: false; missing: string[] } {
  const missing: string[] = [];

  const apiKey = process.env.BREVO_API_KEY;
  const websiteListIdRaw = process.env.BREVO_WEBSITE_LIST_ID;
  const doiTemplateIdRaw = process.env.BREVO_DOI_TEMPLATE_ID;
  const doiRedirectUrl = process.env.BREVO_DOI_REDIRECT_URL;

  if (!apiKey) {
    missing.push("BREVO_API_KEY");
  }

  if (!websiteListIdRaw) {
    missing.push("BREVO_WEBSITE_LIST_ID");
  }

  if (!doiTemplateIdRaw) {
    missing.push("BREVO_DOI_TEMPLATE_ID");
  }

  if (!doiRedirectUrl) {
    missing.push("BREVO_DOI_REDIRECT_URL");
  }

  if (missing.length > 0) {
    return { configured: false, missing };
  }

  const websiteListId = Number.parseInt(websiteListIdRaw as string, 10);
  const doiTemplateId = Number.parseInt(doiTemplateIdRaw as string, 10);

  if (!Number.isFinite(websiteListId) || websiteListId <= 0) {
    missing.push("BREVO_WEBSITE_LIST_ID");
  }

  if (!Number.isFinite(doiTemplateId) || doiTemplateId <= 0) {
    missing.push("BREVO_DOI_TEMPLATE_ID");
  }

  if (missing.length > 0) {
    return { configured: false, missing };
  }

  return {
    configured: true,
    config: {
      apiKey: apiKey as string,
      websiteListId,
      doiTemplateId,
      doiRedirectUrl: doiRedirectUrl as string,
    },
  };
}
