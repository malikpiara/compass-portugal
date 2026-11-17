// Margin, RoundTwenty's review layer: where its script tag and commit meta
// ship (app/(frontend)/layout.js) and where the CSP lets it in (next.config.mjs).
//
// The preview Worker always has it. Production (compassportugal.org) had it
// for the team's reviews (2026-10-08 to launch); it came off for the public
// launch on 2026-11-18, which also removes the passcode curtain (Margin's login
// wall) from the live site. Set MARGIN_ON_PRODUCTION back to true only for a
// review round on production. NODE_ENV keeps it out of `pnpm dev`: `next build`
// sets it to "production", dev does not.
// Visitors without a review link see nothing unless the round has a passcode,
// in which case Margin's curtain asks for it.

export const MARGIN_ORIGIN = "https://margin.roundtwenty.com";
export const MARGIN_ON_PRODUCTION = false;

/** @returns {boolean} */
export function marginOn() {
  return (
    process.env.DEPLOY_ENV === "preview" ||
    (MARGIN_ON_PRODUCTION && process.env.NODE_ENV === "production")
  );
}
