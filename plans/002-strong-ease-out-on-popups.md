# 002 — Use the strong ease-out token on popup and panel entrances

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 5 files, one class added at 6 places

## Problem

Every entrance and exit built with `tw-animate-css` (`animate-in` / `animate-out`) runs on the browser's plain `ease` curve, because none of these elements sets an easing. The installed `node_modules/tw-animate-css/dist/tw-animate.css` defines:

```css
--animate-in: enter var(--tw-animation-duration,var(--tw-duration,.15s)) var(--tw-ease,ease) ...
--animate-out: exit var(--tw-animation-duration,var(--tw-duration,.15s)) var(--tw-ease,ease) ...
```

Plain `ease` is weak for UI entrances: it starts slower than a strong ease-out, so a dropdown or select reaches its final position later than it should. The repo already defines the right curve and does not use it here:

```css
/* app/globals.css:510 */
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
```

Affected elements (dropdowns and selects are opened dozens of times a day in `/admin`):

1. `components/ui/dropdown-menu.tsx:44` — dropdown menu popup: `... shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 ... data-open:animate-in ...`
2. `components/ui/dropdown-menu.tsx:138` — dropdown submenu popup: `... shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 ... data-open:animate-in ...`
3. `components/ui/select.tsx:88` — select popup: `... border-2 border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 data-[align-trigger=true]:animate-none ... data-open:animate-in ...`
4. `components/ui/tooltip.tsx:47` — tooltip popup: `... text-background shadow-lg duration-100 data-open:animate-in ...`
5. `components/admin/save-bar.jsx:45`:
   ```jsx
   <div className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-lg border-2 border-border bg-card px-5 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
   ```
6. `components/analytics/chatbot-conversations.tsx:355`:
   ```jsx
   <div className="mt-4 space-y-3 border-t-2 border-border pt-4 group-open/conv:animate-in group-open/conv:fade-in group-open/conv:duration-150">
   ```

## Target

Each of the six elements sets `--tw-ease` to the existing token by adding the Tailwind v4 class `ease-(--ease-out-quint)`, which compiles to `--tw-ease: var(--ease-out-quint); transition-timing-function: var(--ease-out-quint)`. Durations stay exactly as they are (100ms popups, 200ms save bar, 150ms transcript).

Resulting curve on all six: `cubic-bezier(0.23, 1, 0.32, 1)`.

## Repo conventions to follow

- Easing tokens live in `app/globals.css` inside the `:root` block under "Easing tokens (Emil Kowalski / animations.dev)" (lines ~505-512). Do not add a new curve; use `--ease-out-quint`.
- Tailwind v4 CSS-variable shorthand with parentheses is the house style, e.g. `origin-(--transform-origin)` in the same class strings.

## Steps

1. `components/ui/dropdown-menu.tsx:44`: insert ` ease-(--ease-out-quint)` immediately after `duration-100` in the popup's class string.
2. `components/ui/dropdown-menu.tsx:138`: insert ` ease-(--ease-out-quint)` immediately after `duration-100`.
3. `components/ui/select.tsx:88`: insert ` ease-(--ease-out-quint)` immediately after `duration-100`.
4. `components/ui/tooltip.tsx:47`: insert ` ease-(--ease-out-quint)` immediately after `duration-100`. (If plan 001 is done, `data-instant:animate-none!` is at the end of this string; leave it there.)
5. `components/admin/save-bar.jsx:45`: change `duration-200">` to `duration-200 ease-(--ease-out-quint)">`.
6. `components/analytics/chatbot-conversations.tsx:355`: change `group-open/conv:duration-150">` to `group-open/conv:duration-150 group-open/conv:ease-(--ease-out-quint)">`.

## Boundaries

- Do NOT change durations, slide/zoom/fade classes, `origin-(--transform-origin)`, or any markup.
- Do NOT touch `components/ui/sheet.tsx` or `components/ui/sidebar.tsx` (plans 004 and 005).
- Do NOT add new tokens or edit `app/globals.css`.
- If any excerpt above no longer matches, STOP and report.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` passes; `grep -c "ease-(--ease-out-quint)"` returns 2 for `dropdown-menu.tsx` and 1 for each of the other four files.
- **Feel check** (sandbox dev server, launch config `sandbox-3200`; never plain `pnpm dev`, which points at production):
  - Open a select in `/admin/contacts/<id>` and a dropdown menu (admin header/user menu). In DevTools → Animations, set playback to 10%: the popup covers most of its motion in the first third, then settles. It no longer creeps in.
  - On a selected popup, computed `animation-timing-function` is `cubic-bezier(0.23, 1, 0.32, 1)`.
  - Make an edit in any admin form: the save bar rises and lands quickly, with a soft finish.
  - Rendering panel → emulate `prefers-reduced-motion: reduce`: the global guard in `app/globals.css` still cuts these to near-zero (unchanged behaviour).
- **Done when**: all six elements report the token curve and nothing else changed.
