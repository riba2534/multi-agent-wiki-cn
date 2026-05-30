'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useUI } from '@/components/providers/ui-provider';
import { WikiSidebar } from '@/components/wiki/sidebar';
import type { NavItem } from '@/lib/wiki-nav';

/**
 * Mobile navigation drawer. Reuses the exact same <WikiSidebar> tree as the
 * desktop rail (no duplicated nav data), wrapped in a Radix Dialog for focus
 * trap / scroll lock / Esc, with framer-motion driving the slide-in. Tapping
 * any link inside closes the drawer.
 */
export function MobileNav({ nav }: { nav: NavItem[] }) {
  const { navOpen, setNavOpen, closeNav } = useUI();
  const reduce = useReducedMotion();

  return (
    <Dialog.Root open={navOpen} onOpenChange={setNavOpen}>
      <AnimatePresence>
        {navOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className="fixed inset-y-0 left-0 z-[91] flex w-[84vw] max-w-[320px] flex-col bg-sidebar shadow-2xl lg:hidden"
                style={{
                  paddingTop: 'env(safe-area-inset-top)',
                  paddingBottom: 'env(safe-area-inset-bottom)',
                  paddingLeft: 'env(safe-area-inset-left)',
                  borderRight: '1px solid var(--sidebar-border)',
                }}
                initial={reduce ? { opacity: 0 } : { x: '-100%' }}
                animate={reduce ? { opacity: 1 } : { x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: '-100%' }}
                transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 36 }}
                onClickCapture={(e) => {
                  if ((e.target as Element).closest('a')) closeNav();
                }}
              >
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
                  <Dialog.Title className="flex items-center gap-2 text-[14px] font-bold tracking-tight text-foreground">
                    <Image
                      src="/logo.png"
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded-md shadow-sm"
                    />
                    Multi-Agent Wiki
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="关闭导航菜单"
                    className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3">
                  <WikiSidebar nav={nav} variant="drawer" />
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
