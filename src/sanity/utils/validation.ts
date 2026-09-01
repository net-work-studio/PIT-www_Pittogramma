import type { CustomValidator, ValidationContext } from "@sanity/types";
import { getEmbedInfo } from "@/lib/video-embed";

type ValidationPredicate = (context: ValidationContext) => boolean;
type ValidationResult = true | string;

interface CustomStringValidationRule<T> {
  custom: <LenientFieldValue extends string>(
    fn: CustomValidator<LenientFieldValue | undefined>
  ) => T;
}

function validateOptionalHttpUrl(value: string | undefined): ValidationResult {
  if (!value) {
    return true;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "Must be a valid HTTP(S) URL";
  }

  return ["http:", "https:"].includes(url.protocol)
    ? true
    : "Must use HTTP or HTTPS";
}

export function httpUrlValidation<T extends CustomStringValidationRule<T>>(
  rule: T
): T {
  return rule.custom((value: string | undefined) =>
    validateOptionalHttpUrl(value)
  );
}

export function httpsUrlValidation<T extends CustomStringValidationRule<T>>(
  rule: T
): T {
  return rule.custom((value: string | undefined) => {
    if (!value) {
      return true;
    }

    try {
      return new URL(value).protocol === "https:" ? true : "Must use HTTPS";
    } catch {
      return "Must be a valid HTTPS URL";
    }
  });
}

export function requiredHttpUrlWhen(
  predicate: ValidationPredicate,
  message: string
): <T extends CustomStringValidationRule<T>>(rule: T) => T {
  return (rule) =>
    rule.custom((value: string | undefined, context) => {
      if (predicate(context) && !value) {
        return message;
      }

      return validateOptionalHttpUrl(value);
    });
}

export function requiredHttpsUrlWhen(
  predicate: ValidationPredicate,
  message: string
): <T extends CustomStringValidationRule<T>>(rule: T) => T {
  return (rule) =>
    rule.custom((value: string | undefined, context) => {
      if (predicate(context) && !value) {
        return message;
      }
      if (!value) {
        return true;
      }

      try {
        return new URL(value).protocol === "https:" ? true : "Must use HTTPS";
      } catch {
        return "Must be a valid HTTPS URL";
      }
    });
}

export function videoEmbedUrlValidation<
  T extends CustomStringValidationRule<T>,
>(rule: T): T {
  return rule.custom((value: string | undefined) => {
    const urlResult = validateOptionalHttpUrl(value);
    if (urlResult !== true || !value) {
      return urlResult;
    }

    return getEmbedInfo(value) ? true : "Must be a valid YouTube or Vimeo URL";
  });
}
