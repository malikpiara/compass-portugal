# 005 — Replace the sidebar's linear collapse with a strong ease-in-out

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: LOW
- **Category**: Easing & duration
- **Estimated scope**: 2 files (one new token, three class swaps)

## Problem

Collapsing or expanding the admin sidebar (button, rail or `Cmd/Ctrl+B`) moves at constant speed because three pieces use `ease-linear`. Linear is for constant motion such as progress bars; on-screen movement reads as mechanical with it. Collapsing is rare, so this is polish.

```tsx
/* components/ui/sidebar.tsx:221 — the gap that reserves the sidebar's width */
"relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",

/* components/ui/sidebar.tsx:233 — the fixed sidebar container */
"fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 ...",

/* components/ui/sidebar.tsx:403 — group labels that fade out when collapsed to icons */
"flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 ...",
```

## Target

- New token in `app/globals.css`: `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);` (strong ease-in-out for on-screen movement).
- The three `ease-linear` above become `ease-(--ease-in-out)`. Durations stay `duration-200`. All three must change together, since the gap and the container move in step.
- The rail at `components/ui/sidebar.tsx:292` also says `ease-linear`; leave it (it only toggles on click, and plan 003 edits that line).

## Repo conventions to follow

- Easing tokens live in `app/globals.css` in the `:root` block under the "Easing tokens (Emil Kowalski / animations.dev)" comment (lines ~505-512), next to `--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);`.
- Tokens are used through the Tailwind v4 shorthand `ease-(--token)`, as in `origin-(--transform-origin)`.

## Steps

1. In `app/globals.css`, inside the easing `:root` block, add after `--ease-decelerate`:
   ```css
     /* On-screen movement (sidebar collapse, reorder slides). */
     --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   ```
   If plan 004 already added `--ease-drawer`, keep both.
2. `components/ui/sidebar.tsx:221`: replace `duration-200 ease-linear` with `duration-200 ease-(--ease-in-out)`.
3. `components/ui/sidebar.tsx:233`: replace `duration-200 ease-linear` with `duration-200 ease-(--ease-in-out)`.
4. `components/ui/sidebar.tsx:403`: replace `duration-200 ease-linear` with `duration-200 ease-(--ease-in-out)`.

## Boundaries

- Do NOT change which properties transition (width/left/right/margin are the stock behaviour; changing to transforms is out of scope).
- Do NOT change durations or line 292.
- Do NOT touch `components/ui/sheet.tsx` (plan 004).
- If an excerpt no longer matches, STOP and report.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` passes; `grep -n "ease-linear" components/ui/sidebar.tsx` returns only line 292.
- **Feel check** (sandbox, launch config `sandbox-3200`, desktop width): sign in, press `Cmd/Ctrl+B` a few times.
  - At 10% playback, the sidebar and the page content start gently, move fast in the middle and settle. Nothing moves at constant speed.
  - The page content and the sidebar edge stay in step (no gap opening between them mid-move).
  - Toggle twice quickly: it reverses from where it is (CSS transitions retarget), with no jump.
- **Done when**: the three elements report `cubic-bezier(0.77, 0, 0.175, 1)` and collapse/expand looks continuous.
