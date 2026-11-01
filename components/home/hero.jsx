import Image from "next/image";
import { QuickAccess } from "@/components/home/quick-access";
import { SITE_TEXT_DEFAULTS } from "@/lib/site-text-defaults";

function HeroIllustration() {
  // Faint DS compass behind the hero ("icon-background", Figma Home frame
  // 3393:7186), exported as is: 800×800, 24px from the section's top and
  // 40.65px past its right edge, so the section clips its right side and its
  // bottom runs behind the Quick Access cards.
  return (
    <Image
      src="/illustrations/hero-compass.svg"
      alt=""
      aria-hidden="true"
      width={800}
      height={800}
      className="pointer-events-none absolute -right-[40.65px] top-6 -z-10 hidden w-[800px] max-w-none 2xl:block"
    />
  );
}

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
          <HeroIllustration />
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
