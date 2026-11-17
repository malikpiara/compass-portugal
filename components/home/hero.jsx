import { QuickAccess } from "@/components/home/quick-access";
import { SITE_TEXT_DEFAULTS } from "@/lib/site-text-defaults";

// The faint compass behind the hero (public/illustrations/hero-compass.svg,
// Figma "icon-background") is off for now (2026-11-17). Bring it back from the
// commit that removed it; the SVG is kept.

// Copy comes from the `site-text` global (editable at /admin/site-text); the
// defaults keep bare renders (styleguide) identical to the shipped page.
export function Hero({
  quickAccess = [],
  title = SITE_TEXT_DEFAULTS.heroTitle,
  lead = SITE_TEXT_DEFAULTS.heroLead,
  description = SITE_TEXT_DEFAULTS.heroDescription,
}) {
  return (
    <section className="bg-bg-page">
      <div className="mx-auto max-w-[1680px] px-4 pt-6 sm:px-6 lg:px-14 lg:pt-10">
        <div className="ds-section-padding relative isolate flex flex-col gap-12 overflow-hidden rounded-none xl:rounded-[3.5rem]">
          <div className="max-w-[760px]">
            {/* The icon tile beside the title is hidden in the Compass
                Portugal frame; the title stands alone. */}
            <h1 className="font-heading text-ds-xxxxl font-bold text-primary">
              {title}
            </h1>
            {/* Figma: 24px title → lead, 16px lead → description, both across
                the full 760px text column. */}
            <p className="mt-6 text-ds-l font-bold text-foreground">
              {lead}
            </p>
            <p className="mt-4 text-ds-s font-medium text-foreground">
              {description}
            </p>
          </div>
          <QuickAccess embedded items={quickAccess} />
        </div>
      </div>
    </section>
  );
}
