import DOMPurify from "dompurify";

export function sanitizeText(value: string): string {
  if (typeof window === "undefined") {
    return value.replace(/<[^>]*>?/gm, "").trim();
  }
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).trim();
}