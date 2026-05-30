'use client';
import { Search } from 'lucide-react';
import { useUI } from '@/components/providers/ui-provider';

/** Desktop: a faux search input with a ⌘K hint. Mobile: a compact icon. */
export function SearchTrigger() {
  const { openSearch } = useUI();
  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="搜索文档"
        aria-keyshortcuts="Meta+K Control+K"
        className="hidden h-9 w-52 items-center gap-2 rounded-lg border border-border bg-card/60 px-3 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground sm:flex lg:w-60"
      >
        <Search className="size-4 shrink-0" />
        <span className="text-[13px]">搜索…</span>
        <kbd className="ml-auto rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={openSearch}
        aria-label="搜索文档"
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground sm:hidden"
      >
        <Search className="size-[18px]" />
      </button>
    </>
  );
}
