"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/data/site";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  photographerName?: string;
}

export default function Navbar({ photographerName = "" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = photographerName.trim();
  const homeLabel = displayName || "DAFA";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        id="main-navbar"
        className={cn(
          "fixed top-0 left-0 z-50 w-full transition-all duration-500",
          scrolled ? "py-4" : "py-6",
        )}
      >
        {/* Right side: CTA Button & Mobile Toggle mapped to true top-right corner */}
        <div className="absolute right-4 top-1/2 z-50 flex -translate-y-1/2 items-center gap-3 sm:right-6 lg:right-12">
          <a
            href="/contact"
            className="hidden items-center justify-center rounded-full bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-background shadow-lg transition-transform duration-500 hover:scale-105 md:flex"
          >
            Get in Touch
          </a>

          <button
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border text-foreground md:hidden transition-all duration-500",
              scrolled
                ? "glass-navbar glass-navbar--scrolled border-white/10"
                : "glass-navbar border-white/5",
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-start px-6 md:justify-center lg:px-12 pr-20 md:pr-6">
          {/* Main Pill containing Logo and Links */}
          <div
            className={cn(
              "flex items-center rounded-full border transition-all duration-500 p-1 md:pr-6",
              scrolled
                ? "glass-navbar glass-navbar--scrolled border-white/10"
                : "glass-navbar border-white/5",
            )}
          >
            <Link
              href="/"
              className="flex h-full items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-bold tracking-[0.2em] text-background transition-transform hover:scale-105"
              aria-label={homeLabel}
            >
              {homeLabel}
            </Link>

            <ul className="hidden items-center gap-8 pl-8 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="relative text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center bg-background transition-all duration-500 md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              className={cn(
                "transition-all duration-500",
                mobileOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
              style={{ transitionDelay: mobileOpen ? `${i * 80}ms` : "0ms" }}
            >
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-light uppercase tracking-[0.3em] text-foreground transition-colors hover:text-accent"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li
            className={cn(
              "transition-all duration-500",
              mobileOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
            style={{
              transitionDelay: mobileOpen ? `${NAV_LINKS.length * 80}ms` : "0ms",
            }}
          >
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-block rounded-full border border-accent px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
            >
              Get in Touch
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}