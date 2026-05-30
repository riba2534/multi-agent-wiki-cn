'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface UIContextValue {
  searchOpen: boolean;
  navOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchOpen: (v: boolean) => void;
  openNav: () => void;
  closeNav: () => void;
  setNavOpen: (v: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within <UIProvider>');
  return ctx;
}

/** Shared open-state for the command palette and the mobile nav drawer, plus
 *  the global ⌘K / Ctrl+K shortcut that toggles search. */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <UIContext.Provider
      value={{ searchOpen, navOpen, openSearch, closeSearch, setSearchOpen, openNav, closeNav, setNavOpen }}
    >
      {children}
    </UIContext.Provider>
  );
}
