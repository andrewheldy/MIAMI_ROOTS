"use client";

import { AnimatePresence, m, LazyMotion, domAnimation } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { DURATION, EASE_OUT } from "@/components/motion/tokens";
import { joinNavLink, mainNavLinks } from "@/config/navigation";

/** Media query at which the desktop nav takes over and the menu must close. */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * The mobile/tablet navigation: a hamburger button that morphs into a close
 * icon, opening a branded sheet that drops from the header with a dimmed
 * backdrop. Everything the desktop bar hides at narrow widths lives here, with
 * the "Join the community chats" CTA as the dominant action.
 *
 * Behavior (all required, all handled): closes on link select, Escape, outside
 * (backdrop) click, route change, and resize to desktop; locks body scroll while
 * open; moves focus into the panel on open and restores it to the button on
 * close; traps Tab within the panel; full ARIA wiring and ≥44px targets.
 *
 * Client Component — it owns interaction state only; it fetches no data.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Close on route change so a tapped link never leaves the menu hanging open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close (and release scroll lock) once the viewport reaches desktop.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // While open: lock body scroll, wire Escape + a Tab focus trap, and move
  // focus into the panel. On close, everything is torn down and focus returns.
  useEffect(() => {
    if (!open) return;

    const trigger = buttonRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Focus the first link in the panel once it has mounted.
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      cancelAnimationFrame(raf);
      // Return focus to the trigger that opened the menu.
      trigger?.focus();
    };
  }, [open]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="lg:hidden">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-forest hover:bg-mint-100 relative z-50 -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors"
        >
          <MorphIcon open={open} />
        </button>

        <AnimatePresence>
          {open ? (
            <div className="fixed inset-0 top-0 z-40 lg:hidden">
              {/* Backdrop — dim, tap to close (this is the "outside" region). */}
              <m.button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="bg-foreground/50 absolute inset-0 h-full w-full cursor-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.control, ease: EASE_OUT }}
              />
              {/* Sheet — drops from the top, holding the links + dominant CTA. */}
              <m.div
                id={panelId}
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: DURATION.element, ease: EASE_OUT }}
                className="border-border bg-background absolute inset-x-0 top-0 origin-top rounded-b-2xl border-b px-4 pt-[calc(env(safe-area-inset-top)+4.5rem)] pb-6 shadow-xl sm:px-6"
              >
                <m.ul
                  className="flex flex-col gap-1"
                  initial="hidden"
                  animate="show"
                  variants={{
                    show: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.06,
                      },
                    },
                  }}
                >
                  {mainNavLinks.map((link) => (
                    <m.li
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: DURATION.element,
                            ease: EASE_OUT,
                          },
                        },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={close}
                        className="text-forest hover:bg-surface flex min-h-12 items-center rounded-lg px-3 text-lg font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    </m.li>
                  ))}
                  <m.li
                    className="mt-3"
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: DURATION.element,
                          ease: EASE_OUT,
                        },
                      },
                    }}
                  >
                    <Link
                      href={joinNavLink.href}
                      onClick={close}
                      className="bg-forest text-background hover:bg-forest-600 flex min-h-12 items-center justify-center rounded-xl px-4 text-base font-semibold shadow-sm transition-colors"
                    >
                      {joinNavLink.label}
                    </Link>
                  </m.li>
                </m.ul>
              </m.div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

/**
 * Two bars that cross into an X when open. Decorative — the button's
 * `aria-label` carries the state — so it is hidden from assistive tech.
 */
function MorphIcon({ open }: { open: boolean }) {
  const common = "absolute h-0.5 w-6 rounded-full bg-current";
  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
      <m.span
        className={common}
        style={{ top: "35%" }}
        animate={open ? { rotate: 45, top: "50%" } : { rotate: 0, top: "35%" }}
        transition={{ duration: DURATION.control, ease: EASE_OUT }}
      />
      <m.span
        className={common}
        style={{ top: "50%" }}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: DURATION.control, ease: EASE_OUT }}
      />
      <m.span
        className={common}
        style={{ top: "65%" }}
        animate={open ? { rotate: -45, top: "50%" } : { rotate: 0, top: "65%" }}
        transition={{ duration: DURATION.control, ease: EASE_OUT }}
      />
    </span>
  );
}
