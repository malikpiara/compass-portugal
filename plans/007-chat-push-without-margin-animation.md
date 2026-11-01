# 007 — Stop animating the page's margin when the chat opens

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file, 1 class string

## Problem

On the public site, opening the help chat on desktop pushes the whole page left: the page wrapper's right margin animates from 0 to 380px over 200ms. `margin` is a layout property, so every frame re-lays out and re-wraps the entire page (hero, cards, contacts table), which can drop frames on slower laptops. The push itself (instead of overlaying) is a documented design decision and stays; only the animated margin changes.

```jsx
/* components/site/zapier-chatbot.jsx:88-96 — current */
{/* Page body — shrinks on desktop when the panel is open, so the sidebar
    pushes content left rather than overlaying it. `380px` matches the
    panel width below; keep them equal. No push below `md` (mobile card). */}
<div
  className={cn(
    "flex min-h-dvh flex-col transition-[margin] duration-200 ease-out motion-reduce:transition-none",
    mounted && open && "md:mr-[380px]",
  )}
>
```

The panel itself already slides in on GPU-friendly properties (line 153):

```jsx
"transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
```

## Target

The page reflows to its narrower width once, in a single frame, while the panel keeps its 200ms slide:

```jsx
"flex min-h-dvh flex-col",
mounted && open && "md:mr-[380px]",
```

That is: remove `transition-[margin] duration-200 ease-out motion-reduce:transition-none` from the wrapper. Nothing else changes.

Known trade-off to check: on open, the page narrows instantly and the 380px strip on the right is empty for up to 200ms until the panel arrives (the strip shows the page background, `#f2fcfc`). On close the panel slides out over a page that is already full width, which is fine.

## Repo conventions to follow

- Motion in this file is CSS transitions on `transform`/`opacity` with `ease-out` and `motion-reduce:transition-none` (lines 123-125, 153). Keep the panel as is.

## Steps

1. In `components/site/zapier-chatbot.jsx`, line 92, change the string `"flex min-h-dvh flex-col transition-[margin] duration-200 ease-out motion-reduce:transition-none"` to `"flex min-h-dvh flex-col"`.
2. Update the comment above the wrapper (lines 88-90) by appending one sentence: `The margin snaps rather than animating: animating it re-laid out the whole page every frame.`

## Boundaries

- Do NOT change the panel (lines ~139-158), the launcher, the 380px width, or the mobile behaviour.
- Do NOT replace the push with an overlay; the push is a documented decision.
- If the excerpt no longer matches, STOP and report.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` passes; `grep -n "transition-\[margin\]" components/site/zapier-chatbot.jsx` returns nothing.
- **Feel check** (needs a human on a real laptop; sandbox, launch config `sandbox-3200`, width ≥ 1024px): open and close the chat from the orange launcher on the home page several times.
  - DevTools → Performance, record an open: no long layout tasks repeated across ~12 frames; one layout at the start.
  - Watch the empty strip on open at normal speed. If the flash of empty background reads as a glitch, STOP and report: the fallback is to keep the current animated margin, and this plan is then dropped, not retuned.
  - Close: the page is full width immediately and the panel slides away over it.
  - Mobile (375px): unchanged, the chat still opens as a full-screen sheet from the bottom.
- **Done when**: the wrapper has no margin transition and a human has signed off on the open feel.
