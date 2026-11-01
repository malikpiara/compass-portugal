# 006 — Move the reorder slide onto the shared ease-in-out token

- **Status**: TODO
- **Commit**: 5113803 (written against a working tree with uncommitted motion edits; commit those first, see `plans/README.md`)
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Depends on**: plan 005 (adds `--ease-in-out`)
- **Estimated scope**: 1 file, 1 line

## Problem

When an editor moves a section, block, link or FAQ up or down, the rows slide to their new places (FLIP in `lib/use-flip.js`). The slide uses a one-off curve typed inline instead of a shared token, and it is on-screen movement, which the motion vocabulary times with ease-in-out.

```js
/* lib/use-flip.js:50-53 — current */
requestAnimationFrame(() => {
  el.style.transition = "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)";
  el.style.transform = "";
});
```

The teal flash that accompanies a reorder (`.reorder-flash` in `app/globals.css`, documented as deliberate feedback for non-technical editors) is out of scope.

## Target

```js
el.style.transition = "transform 280ms var(--ease-in-out)";
```

`--ease-in-out` is `cubic-bezier(0.77, 0, 0.175, 1)`, defined on `:root` by plan 005, so an inline style on any element resolves it. Duration stays 280ms.

## Repo conventions to follow

- Easing tokens live in `app/globals.css` (`:root` easing block). Plan 005 adds `--ease-in-out` there; check it exists before this step.

## Steps

1. Confirm `grep -n "\-\-ease-in-out" app/globals.css` finds the token. If not, STOP: run plan 005 first.
2. In `lib/use-flip.js:51`, replace `"transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)"` with `"transform 280ms var(--ease-in-out)"`.

## Boundaries

- Do NOT change the 280ms duration, the `transition = "none"` reset on line 48, or the reorder flash.
- Do NOT edit any other file.

## Verification

- **Mechanical**: `pnpm exec tsc --noEmit -p .` passes; `grep -n "cubic-bezier" lib/use-flip.js` returns nothing.
- **Feel check** (sandbox, launch config `sandbox-3200`): open an article with several sections in `/admin/articles/<id>` and press a section's Move down a few times, then quickly twice in a row.
  - At 10% playback, the row eases out of its old place and eases into its new one; nothing moves at constant speed.
  - The teal flash still plays on the moved row.
  - A second quick move starts from the row's current spot (no snap back).
  - Feel can only be judged live: if the slide now reads slower at the start than before, report it rather than retuning the curve.
- **Done when**: the inline transition uses `var(--ease-in-out)` and reorders still slide.
