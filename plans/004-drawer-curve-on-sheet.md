# 004 — Give the slide-over sheet a drawer curve instead of ease-in-out

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: LOW
- **Category**: Easing & duration
- **Estimated scope**: 2 files (one new token, one class)

## Problem

The sheet (slide-over panel) enters and leaves on `ease-in-out`, which starts slowly. A panel coming on screen should start fast and settle. Today the only user is the admin sidebar on mobile (`components/ui/sidebar.tsx` renders `Sheet`), so the frequency is low, but it is the first thing an editor sees when opening the menu on a phone.

```tsx
/* components/ui/sheet.tsx:56 — current (start of the class string) */
"fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 ..."
```

The backdrop on line 31 uses `transition-opacity duration-150` with Tailwind's default curve; leave it.

## Target

- New token in `app/globals.css`: `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);` (the iOS-like drawer curve).
- Sheet panel: `ease-in-out` replaced by `ease-(--ease-drawer)`. Duration stays `duration-200`.

## Repo conventions to follow

- Easing tokens live in `app/globals.css`, in this block (lines ~505-512):
  ```css
  /* Easing tokens (Emil Kowalski / animations.dev) — the shared motion vocabulary
     with the Almond (mindful) project, so easings copy-paste 1:1 across them. */
  :root {
    --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
    --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
    --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-decelerate: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  ```
- Tokens are used through the Tailwind v4 shorthand `ease-(--token)`.

## Steps

1. In `app/globals.css`, inside that `:root` block, add after the `--ease-decelerate` line:
   ```css
     /* Drawers and slide-over sheets: starts fast, settles like iOS sheets. */
     --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
   ```
   If plan 005 already added `--ease-in-out` there, keep both; order does not matter.
2. In `components/ui/sheet.tsx:56`, replace `duration-200 ease-in-out` with `duration-200 ease-(--ease-drawer)`.

## Boundaries

- Do NOT change the sheet's translate distances (`2.5rem`), opacity states, backdrop, or duration.
- Do NOT touch `components/ui/sidebar.tsx` (plan 005).
- If the excerpts no longer match, STOP and report.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` passes; `grep -n "ease-in-out" components/ui/sheet.tsx` returns nothing; `grep -n "\-\-ease-drawer" app/globals.css` returns the new token.
- **Feel check** (sandbox, launch config `sandbox-3200`, viewport 375×812): sign in, open `/admin`, open the menu.
  - DevTools → Animations at 10%: the panel moves most of its distance early and eases into place; no slow start.
  - Close it: it leaves promptly without hanging at the start.
  - Emulate `prefers-reduced-motion: reduce`: the global guard still removes the motion.
- **Done when**: the sheet's computed `transition-timing-function` is `cubic-bezier(0.32, 0.72, 0, 1)`.
