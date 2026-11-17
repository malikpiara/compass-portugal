import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SiteNav } from "@/components/site/site-nav";
import { DONATE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

// The header's Donate button is hidden for now (2026-11-17). Set back to true
// to show it again; DONATE_URL in lib/site.ts still holds the destination.
const SHOW_DONATE = false;

export function SiteHeader({ sticky = true } = {}) {
  return (
    <header
      className={cn(
        "z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85",
        sticky && "sticky top-0"
      )}
    >
      <div className="mx-auto flex min-h-[72px] max-w-[1680px] items-center justify-between px-4 py-4 sm:px-6 lg:px-14">
        {/* The Compass Portugal lockup, exported from the DS brand component
            (Figma 3112:9963, orientation=compassPortugal) as one SVG with the
            type outlined. Its viewBox is trimmed to the artwork (the export
            carried ~16px of empty space around it), and it is drawn at the
            old Admin Hub logo's size: artwork 40px tall, flush at the gutter.
            Figma's 378×98 read far too big on the site (Malik, 2026-11-01). */}
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src="/compass-portugal-logo.svg"
            alt="Compass Portugal, by Lisbon Project"
            width={349}
            height={66}
            priority
            unoptimized
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <SiteNav />
          {SHOW_DONATE ? (
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                className: "px-4",
              })}
            >
              Donate
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
