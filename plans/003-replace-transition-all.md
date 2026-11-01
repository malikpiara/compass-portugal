# 003 — Replace the last four `transition-all`s with explicit properties

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 4 files, one class each

## Problem

`transition-all` transitions every property that changes, including ones nobody meant to animate (layout properties, font changes, colours set by state). It is always worth replacing with the properties that actually change. Four remain:

1. `components/admin/block-editor.jsx:661` (Add block menu choices; hover changes border colour, press moves 1px):
   ```jsx
   className="flex animate-entry-appear items-center gap-3 rounded-lg border-2 border-border bg-card p-2.5 text-left transition-all hover:border-primary active:translate-y-px"
   ```
2. `components/calendar/calendar-adamastor.css:142-145` (public `/calendar` events; hover changes background):
   ```css
   .adamastor-calendar .rbc-event {
     @apply bg-[#dff6f7] hover:bg-[#dff6f7]/80 text-[#28aeb8] rounded-md px-1;
     @apply transition-all duration-200;
   }
   ```
3. `components/ui/sidebar.tsx:292` (the sidebar rail; hover shows a line via `hover:after:bg-sidebar-border`):
   ```tsx
   "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
   ```
4. `app/(frontend)/components/_components/color-grid.tsx:170` (styleguide colour swatch; hover lifts 2px and grows a shadow):
   ```tsx
   <div className="group min-w-0 overflow-hidden rounded-lg border-2 border-border bg-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
   ```

## Target

Each element transitions only what its states change; durations and easings unchanged:

1. block-editor: `transition-[border-color,transform]`
2. calendar: `transition-colors duration-200` (background colour is the only change)
3. sidebar rail: `transition-[left,right]` keeping `ease-linear` here (plan 005 retimes the sidebar). The rail's hover line is on `::after` and is not transitioned today; leave it so.
4. color-grid: `transition-[transform,box-shadow] duration-150`

## Repo conventions to follow

- Explicit property lists with Tailwind arbitrary values are already used, e.g. `transition-[transform,opacity]` in `components/site/zapier-chatbot.jsx:153` and `transition-[color,background-color,border-color,box-shadow,transform]` in `components/ui/button.tsx`.

## Steps

1. `components/admin/block-editor.jsx:661`: replace `transition-all` with `transition-[border-color,transform]`.
2. `components/calendar/calendar-adamastor.css:144`: replace `@apply transition-all duration-200;` with `@apply transition-colors duration-200;`.
3. `components/ui/sidebar.tsx:292`: replace `transition-all ease-linear` with `transition-[left,right] ease-linear`.
4. `app/(frontend)/components/_components/color-grid.tsx:170`: replace `transition-all duration-150` with `transition-[transform,box-shadow] duration-150`.

## Boundaries

- Do NOT remove any hover or press effect, change durations, or change easings.
- Do NOT touch other lines in these files.
- If an excerpt no longer matches, STOP and report.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` passes; `grep -rn "transition-all" app components` returns nothing.
- **Feel check** (sandbox, launch config `sandbox-3200`):
  - `/admin/articles/<id>` → Add block: hovering a choice still changes its border to teal smoothly; pressing still nudges it 1px.
  - `/calendar`: hovering an event still fades its background.
  - `/components/colors` (the styleguide's Colors page renders `ColorGrid`): swatches still lift and gain a shadow on hover.
  - Admin sidebar: hovering the rail still shows the line; clicking it still toggles the sidebar.
- **Done when**: no `transition-all` remains and every hover/press looks exactly as before.
