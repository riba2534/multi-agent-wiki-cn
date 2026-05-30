import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { UIProvider } from '@/components/providers/ui-provider';
import { TopNav } from '@/components/top-nav';
import { MobileNav } from '@/components/wiki/mobile-nav';
import { CommandPalette } from '@/components/search/command-palette';
import { getNav } from '@/lib/wiki-nav';
import { getSearchIndex } from '@/lib/search-index';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    '多智能体', '智能体', '大语言模型', '编排', '监督者', '交接',
    '多智能体系统', '智能体模式', 'AI工程', 'MCP', 'A2A',
  ],
  authors: [{ name: 'riba2534', url: 'https://github.com/riba2534' }],
  creator: 'riba2534',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: '@riba2534',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/',
    types: { 'text/markdown': '/llms.txt' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3fa' },
    { media: '(prefers-color-scheme: dark)',  color: '#1a1625' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The desktop sidebar lives in the (docs) layout so the home page can render
  // full-bleed without it. The mobile drawer + command palette stay here in the
  // root so they're reachable from every route, including the landing cover.
  const nav = getNav();
  const searchIndex = getSearchIndex();

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UIProvider>
            <div className="relative min-h-dvh bg-background text-foreground">
              {/* Top brand glow */}
              <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:opacity-20"
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.55 0.22 275 / 0.10), transparent)',
                }}
                aria-hidden
              />
              {/* Dot-grid texture + secondary cyan glow */}
              <div className="bg-ambient" aria-hidden />
              <TopNav />

              {children}
            </div>

            <MobileNav nav={nav} />
            <CommandPalette index={searchIndex} />
            <Toaster theme="system" position="bottom-right" closeButton />
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
