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
        {/* The Compass Portugal wordmark (Figma 4043:1063, "Compass" over
            "Portugal", 2026-11-17), exported as one SVG with the type outlined.
            The export's canvas background is removed and its viewBox trimmed to
            the artwork (129.5×55.4). Drawn at its Figma size from lg up (56px
            tall) and 40px tall below, beside the menu button. */}
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src="/compass-portugal-logo.svg"
            alt="Compass Portugal"
            width={130}
            height={55}
            priority
            unoptimized
            className="h-10 w-auto lg:h-14"
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
