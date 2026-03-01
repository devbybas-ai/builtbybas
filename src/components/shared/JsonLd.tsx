/**
 * JsonLd component for structured data.
 *
 * Security note: This component uses dangerouslySetInnerHTML as required by
 * the JSON-LD web standard. All data passed to this component MUST be from
 * hardcoded helper functions in src/lib/json-ld.ts — never from user input.
 */
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
