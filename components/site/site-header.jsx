import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SiteNav } from "@/components/site/site-nav";
import { DONATE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

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
            type outlined, so the letterforms and spacing are the designer's.
            Figma draws it at 378×98 (Home frame 3393:7186); on the site that
            read far too big (Malik, 2026-11-01), so it is 56px tall from lg
            up (about 216 wide, "by lisbon project" still legible) and steps
            down to fit beside Menu and Donate on smaller screens. */}
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src="/compass-portugal-logo.svg"
            alt="Compass Portugal, by Lisbon Project"
            width={378}
            height={98}
            priority
            unoptimized
            className="h-10 w-auto sm:h-12 lg:h-14"
          />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <SiteNav />
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
        </nav>
      </div>
    </header>
  );
}
