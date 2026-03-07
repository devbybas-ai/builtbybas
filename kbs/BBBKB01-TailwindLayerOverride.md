# BBBKB01 - Tailwind CSS 4 @layer utilities Override

## Problem

Custom CSS classes defined inside `@layer utilities` (e.g., `.neon-glow`, `.btn-shine`, `.glass-card`) were silently overridden by Tailwind CSS 4 utility classes applied inline on the same element.

Symptoms:
- `box-shadow`, `border`, and `animation` properties set in custom classes had no visible effect
- The shimmer animation (`btn-shine::after`) appeared to work intermittently
- No errors or warnings in console — styles were simply not applied

## Root Cause

In Tailwind CSS 4, the framework's own utility classes (e.g., `bg-primary`, `rounded-lg`) have **higher specificity** than anything declared inside `@layer utilities`. This is by design in the CSS cascade layers spec — Tailwind's generated utilities win over user-defined `@layer utilities` styles.

When a component like:
```html
<Link className="btn-shine neon-glow rounded-lg bg-primary px-4 py-2 ...">
```
...combines custom classes (`btn-shine`, `neon-glow`) with Tailwind utilities (`bg-primary`, `rounded-lg`), the Tailwind utilities override conflicting properties from the custom classes.

## Resolution

Move custom CSS classes **out of** `@layer utilities` into unscoped CSS (no layer). This gives them normal CSS specificity, which is higher than layered styles.

**Before (broken):**
```css
@layer utilities {
  .neon-glow {
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.2);
  }
}
```

**After (working):**
```css
/* Outside @layer so they aren't overridden by Tailwind utilities */
.neon-glow {
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.2);
}
```

## Applies To

- Any custom CSS class in `globals.css` that sets properties also touched by Tailwind utilities
- Tailwind CSS v4+ projects using `@import "tailwindcss"`

## Related Files

- `src/app/globals.css` — all custom classes moved out of `@layer utilities`

## Date Resolved

2026-03-06
