"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The header logo. On any other page it is a plain link home. On the home page
// itself a plain click scrolls back to the top instead: a <Link> to the URL
// you are on only refetches the page and runs the content's <ViewTransition>
// against an identical copy of itself, so the page flashes and stays where it
// was (2026-11-17). Modified clicks (new tab, new window) keep the link.
export function HomeLogoLink({ children, className }) {
  const pathname = usePathname();

  function handleClick(event) {
    if (pathname !== "/") return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Arrived via /#services or /#contacts: drop the hash so the URL is home.
    if (window.location.hash) {
      window.history.replaceState(null, "", "/");
    }
  }

  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
