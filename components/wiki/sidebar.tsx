'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { NavItem, NavLeaf, NavGroupLabel } from '@/lib/wiki-nav';
import { cn } from '@/lib/utils';

interface Props {
  nav: NavItem[];
  /** 'desktop' is the sticky rail in the layout; 'drawer' is the mobile sheet,
   *  which lets its parent own scrolling and skips scroll persistence. */
  variant?: 'desktop' | 'drawer';
}

const SCROLL_KEY = 'wiki:sidebar-scroll';

// SSR-safe useLayoutEffect.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function WikiSidebar({ nav, variant = 'desktop' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDrawer = variant === 'drawer';

  // Capture scroll position the instant the user clicks any link inside the
  // sidebar, BEFORE Next.js (or framer-motion's layoutId animations) get a
  // chance to mutate scrollTop on the container. Saving on scroll events
  // alone races with the auto-scroll Next.js performs on navigation.
  useEffect(() => {
    if (isDrawer) return;
    const el = scrollRef.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest('a')) {
        sessionStorage.setItem(SCROLL_KEY, String(el.scrollTop));
      }
    };
    el.addEventListener('click', onClick, true);
    return () => el.removeEventListener('click', onClick, true);
  }, [isDrawer]);

  // Restore on every route change, synchronously after DOM updates — this
  // wins over any post-navigation scroll reset.
  useIsoLayoutEffect(() => {
    if (isDrawer) return;
    const el = scrollRef.current;
    if (!el) return;
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved !== null) el.scrollTop = Number(saved) || 0;
  }, [pathname, isDrawer]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        isDrawer
          ? ''
          : 'sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain',
      )}
    >
      <nav className={cn('flex flex-col gap-0.5', isDrawer ? 'py-4 pr-1' : 'py-6 pr-4')}>
      {nav.map((item, i) =>
        item.type === 'doc' ? (
          <NavDoc key={item.href} item={item} />
        ) : (
          <NavCategory
            key={`cat-${i}`}
            label={item.label}
            href={item.href}
            items={item.items}
          />
        ),
      )}
      </nav>
    </div>
  );
}

function NavDoc({ item, depth = 0 }: { item: NavLeaf; depth?: number }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={cn(
        'relative flex items-center rounded-lg py-1.5 text-[13px] leading-tight transition-all duration-200',
        depth === 0 ? 'pl-3 pr-2' : 'pl-5 pr-2',
        active
          ? 'text-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      )}
    >
      {active && (
        <motion.span
          layoutId="wiki-active-pill"
          className="absolute inset-0 -z-0 rounded-lg bg-sidebar-accent shadow-sm"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      {active && (
        <motion.span
          layoutId="wiki-active-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
          style={{ background: 'var(--brand-gradient)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <span className={cn('relative z-10 truncate', active && 'font-semibold')}>{item.label}</span>
    </Link>
  );
}

function NavGroup({ label }: { label: NavGroupLabel['label'] }) {
  return (
    <div className="mt-4 mb-0.5 px-3 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
      {label}
    </div>
  );
}

function NavCategory({
  label,
  href,
  items,
}: {
  label: string;
  href?: string;
  items: (NavLeaf | NavGroupLabel)[];
}) {
  const pathname = usePathname();
  // Sections start expanded — this is a small wiki and collapsing them would
  // hide navigation for the sibling sections while reading a page.
  const [open, setOpen] = useState<boolean>(true);
  const docCount = items.filter(i => i.type === 'doc').length;
  const labelActive = href && pathname === href;

  // Header is a flex row: chevron (toggle) + label (link if href).
  // Keeping them as separate clickable surfaces means clicking the chevron
  // toggles without navigating, and clicking the label navigates without
  // collapsing the section.
  return (
    <div className="mt-5 first:mt-1">
      <div className="flex w-full items-center gap-0.5 px-2 py-1.5">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex size-5 items-center justify-center rounded-md text-brand transition-all duration-200 hover:bg-brand/10 hover:scale-110"
          aria-label={open ? `折叠 ${label}` : `展开 ${label}`}
          aria-expanded={open}
        >
          <ChevronRight
            className={cn('size-3 transition-transform duration-200', open && 'rotate-90')}
          />
        </button>
        {href ? (
          <Link
            href={href}
            className={cn(
              'flex flex-1 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors',
              labelActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground',
            )}
          >
            <span>{label}</span>
            <span className="ml-auto font-sans text-[10px] font-normal tracking-normal text-muted-foreground/50">
              {docCount}
            </span>
          </Link>
        ) : (
          <span className="flex flex-1 items-center gap-1.5 px-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">
            {label}
            <span className="ml-auto font-sans text-[10px] font-normal tracking-normal text-muted-foreground/50">
              {docCount}
            </span>
          </span>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 flex flex-col gap-0.5">
              {items.map((it, i) =>
                it.type === 'group' ? (
                  <NavGroup key={`g-${i}`} label={it.label} />
                ) : (
                  <NavDoc key={it.href} item={it} depth={1} />
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
