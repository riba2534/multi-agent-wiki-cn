'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { LogoMark } from './logo';
import { ThemeToggle } from './theme-toggle';
import { SearchTrigger } from './search/search-trigger';
import { useUI } from './providers/ui-provider';

export function TopNav() {
  const { openNav, navOpen } = useUI();
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-background/65 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
      style={{
        borderImage: 'linear-gradient(90deg, oklch(0.55 0.22 275 / 0), oklch(0.55 0.22 275 / 0.35), oklch(0.65 0.18 300 / 0.35), oklch(0.55 0.22 275 / 0)) 1',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 lg:px-6">
        {/* Hamburger — mobile/tablet only */}
        <button
          type="button"
          onClick={openNav}
          aria-label="打开导航菜单"
          aria-expanded={navOpen}
          className="-ml-1 inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md dark:ring-white/10"
            style={{
              background: 'var(--brand-gradient)',
            }}
          >
            <LogoMark size={17} style={{ color: '#fff' }} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">
            多智能体 Wiki
            <span className="ml-2 hidden font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/60 sm:inline-block">
              模式·运行时·参考
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}