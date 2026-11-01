# 001 — Skip the tooltip animation when hopping between tooltips

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: MEDIUM
- **Category**: Easing & duration (tooltip behaviour in toolbars)
- **Estimated scope**: 1 file, 1 class

## Problem

Every tooltip plays its 100ms fade + zoom, including when the pointer slides from one toolbar button to the next. After the first tooltip in a group has opened, the next ones should appear instantly; replaying the entrance on every button makes a toolbar feel sluggish. Toolbars with grouped tooltips in this app: the text editor's formatting bar (Bold, Italic, lists, link) on every article, FAQ, service and contact form, the table formatting bar, and the collapsed admin sidebar.

Base UI already tells us when to skip it. In the installed `@base-ui/react@1.4.1`, `esm/tooltip/popup/TooltipPopupDataAttributes.d.ts` documents:

```ts
/**
 * Present if animations should be instant.
 */
instant = "data-instant",
```

(`TooltipPopup.d.ts`: `instant: 'delay' | 'focus' | 'dismiss' | undefined`.) Our component never reads it.

```tsx
/* components/ui/tooltip.tsx:44-49 — current */
<TooltipPrimitive.Popup
  data-slot="tooltip-content"
  className={cn(
    "z-50 max-w-64 origin-(--transform-origin) rounded-lg bg-foreground px-3 py-2 text-ds-xxs font-medium text-background shadow-lg duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
    className
  )}
```

## Target

When the popup carries `data-instant`, it has no animation at all: `animation: none`, applied with Tailwind v4's important suffix so it beats `data-open:animate-in` / `data-closed:animate-out` regardless of CSS order.

```tsx
/* target — same string with one class appended */
"z-50 max-w-64 origin-(--transform-origin) rounded-lg bg-foreground px-3 py-2 text-ds-xxs font-medium text-background shadow-lg duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-instant:animate-none!",
```

## Repo conventions to follow

- Tailwind v4 data-attribute variants are already used in this exact string (`data-open:`, `data-closed:`); `data-instant:` is the same pattern.
- The important modifier in Tailwind v4 is a trailing `!` (e.g. `size-8!` in `components/ui/sidebar.tsx:478`).

## Steps

1. In `components/ui/tooltip.tsx`, in the `className` string of `TooltipPrimitive.Popup` (line 47), append ` data-instant:animate-none!` at the end of the string, after `data-closed:zoom-out-95`. Change nothing else.

## Boundaries

- Do NOT touch `TooltipProvider` delays (`delay = 150`) or any other tooltip prop.
- Do NOT change the existing animation classes; plan 002 changes their easing separately.
- Do NOT edit any other file.
- If line 47 no longer matches the excerpt above, STOP and report.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` and `pnpm exec eslint components/ui/tooltip.tsx` pass.
- **Feel check** (run `pnpm dev` against the SQLite sandbox: the `sandbox-3200` launch config; never plain `pnpm dev`, which points at production): open any article in `/admin/articles/<id>`, hover Bold, wait for its tooltip, then slide straight to Italic, the list buttons and Link.
  - The first tooltip fades and zooms in; each following one appears instantly, with no zoom.
  - In DevTools, select a tooltip popup after hopping: it has the `data-instant` attribute and computed `animation-name: none`.
  - Leave the toolbar for a second and hover again: the first tooltip animates again.
- **Done when**: hopping across the toolbar shows no tooltip entrance after the first one.
