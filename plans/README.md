# Animation plans

Written by the `improve-animations` audit on 2026-11-01 at commit `5113803`. Each plan is self-contained: hand one file to any agent and it has the exact code, values and checks.

**Before running any plan**, commit the working-tree changes that were pending when these were written (the `remove-animations` pass, the logo resize and the sign-in wording). Plans 002 and 003 quote lines that only exist after that pass (`button.tsx`'s explicit transition list, the Add block menu without its stagger, the transcript fade at 150ms).

Always run the dev server through the `sandbox-3200` launch config. Plain `pnpm dev` points at the production database.

| # | Plan | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| 001 | [Skip the tooltip animation when hopping between tooltips](001-instant-tooltips-in-a-group.md) | MEDIUM | Easing & duration | TODO |
| 002 | [Use the strong ease-out token on popup and panel entrances](002-strong-ease-out-on-popups.md) | MEDIUM | Easing & duration | TODO |
| 003 | [Replace the last four `transition-all`s](003-replace-transition-all.md) | LOW | Performance | TODO |
| 004 | [Give the slide-over sheet a drawer curve](004-drawer-curve-on-sheet.md) | LOW | Easing & duration | TODO |
| 005 | [Replace the sidebar's linear collapse with a strong ease-in-out](005-sidebar-collapse-easing.md) | LOW | Easing & duration | TODO |
| 006 | [Move the reorder slide onto the shared ease-in-out token](006-flip-reorder-curve-token.md) | LOW | Cohesion & tokens | TODO |
| 007 | [Stop animating the page's margin when the chat opens](007-chat-push-without-margin-animation.md) | LOW | Performance | TODO |

## Recommended order

1. **001**, then **002**: both edit `components/ui/tooltip.tsx:47`; doing 001 first keeps 002's step simple. Highest leverage: the text editor toolbars and every admin dropdown/select.
2. **003**: independent; it also edits `components/ui/sidebar.tsx:292`, which 005 deliberately leaves alone.
3. **005**, then **006**: 005 adds the `--ease-in-out` token that 006 uses.
4. **004**: independent; adds `--ease-drawer` to the same token block as 005 (either order works, keep both tokens).
5. **007** last: it needs a person to judge the open on a real laptop and may be dropped if the empty strip reads as a glitch.

## Dependencies

- 006 requires 005.
- 001 and 002 touch the same line; run them in sequence, not in parallel.
- 004 and 005 both add a token to the `:root` easing block in `app/globals.css`; in parallel worktrees they would conflict on that block.

## Not planned (noted in the audit)

- The reduced-motion guard at the end of `app/globals.css` switches off all motion, including fades. The comment there documents that as deliberate, so it is not a finding.
- Two layout jumps, which need layout fixes rather than motion: the "Links to … / Edit / Remove link" bar in `components/admin/rich-text-editor.tsx` pushes the text down whenever the caret enters a link, and the table formatting bar's hint changes from two lines to one on focus, moving the table.
