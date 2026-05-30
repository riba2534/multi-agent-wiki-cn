'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
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
          <Image
            src="/logo.png"
            alt="Multi-Agent Wiki"
            width={32}
            height={32}
            priority
            className="size-8 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[15px] font-bold tracking-tight">
            Multi-Agent Wiki
            <span className="ml-2 hidden font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/60 sm:inline-block">
              模式·运行时·参考
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <SearchTrigger />
          <a
            href="https://github.com/riba2534/multi-agent-wiki-cn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="在 GitHub 上查看本项目"
            title="GitHub 仓库"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-accent/60 hover:text-foreground hover:shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}