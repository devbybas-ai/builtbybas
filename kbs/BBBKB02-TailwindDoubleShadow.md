# BBBKB02 - Tailwind Double Shadow Class Conflict

## Problem

Using two separate Tailwind shadow utilities on the same element causes only the last one to apply, producing unexpected visual results (e.g., a horizontal cyan streak instead of a proper glow).

Symptoms:
- Cards show a weird horizontal glow bar instead of a soft surrounding glow
- One card in a grid looks different from others (depending on render order)

## Root Cause

Tailwind shadow utilities (`shadow-*`) all compile to the same `--tw-shadow` CSS variable. When two are applied, the second overwrites the first.

**Broken example:**
```html
<div class="hover:shadow-[0_0_30px_-5px] hover:shadow-primary/15">
```

This generates:
- `hover:shadow-[0_0_30px_-5px]` sets `--tw-shadow: 0 0 30px -5px` (no color — defaults to black or transparent)
- `hover:shadow-primary/15` sets `--tw-shadow: var(--color-primary) / 0.15` (overrides the previous)

The result is unpredictable — sometimes you get a colored shadow with wrong dimensions, sometimes no shadow at all.

## Resolution

Use a single arbitrary `box-shadow` value that includes both the dimensions and color:

```html
<div class="hover:[box-shadow:0_0_30px_-5px_rgba(0,212,255,0.15)]">
```

Or use Framer Motion's `whileHover` for animated shadows (as done in `ServiceCard.tsx`):
```tsx
whileHover={{
  boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)",
}}
```

## Applies To

- Any Tailwind element using multiple `shadow-*` classes
- Hover states combining shadow size with shadow color

## Related Files

- `src/components/public-site/AboutPillars.tsx`
- `src/components/public-site/AboutValues.tsx`
- `src/components/public-site/AboutStory.tsx`

## Date Resolved

2026-03-06
