# BBBKB03 - Inset Glow Invisible on Same-Color Background

## Problem

An inset `box-shadow` glow using cyan (`rgba(0, 212, 255, ...)`) is invisible on a button with a cyan background (`bg-primary` = `#00D4FF`).

Symptoms:
- Button appears flat with no visible glow
- CSS is correctly applied (visible in DevTools) but produces no visual contrast

## Root Cause

Cyan glow on a cyan background has zero contrast. The glow color blends entirely into the background color, making it invisible to the human eye.

## Resolution

Use **white** for inset glow effects on colored backgrounds. White creates visible contrast against any background color.

**Before (invisible):**
```css
.neon-glow {
  box-shadow: inset 0 0 12px rgba(0, 212, 255, 0.35);
}
```

**After (visible):**
```css
.neon-glow {
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.52),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.26);
}
```

## Rule of Thumb

- Glow on **dark backgrounds** — use the accent color (cyan)
- Glow on **colored backgrounds** — use white or a lighter shade
- Glow that must stay **within boundaries** — use `inset` box-shadow + `overflow: hidden` on the container

## Related Files

- `src/app/globals.css` — `.neon-glow` class
- `src/components/layout/PublicHeader.tsx` — "Start a Project" button

## Date Resolved

2026-03-06
