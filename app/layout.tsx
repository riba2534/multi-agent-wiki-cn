import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme-provider';
import { TopNav } from '@/components/top-nav';
import { WikiSidebar } from '@/components/wiki/sidebar';
import { getNav } from '@/lib/wiki-nav';
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
  authors: [{ name: 'fuergaosi233', url: 'https://github.com/fuergaosi233' }],
  creator: 'fuergaosi233',
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
    creator: '@fuergaosi233',
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
  // Sidebar lives here in the root layout so it persists across navigation —
  // preserving scroll position and avoiding a flash of re-render.
  const nav = getNav();

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
          <div className="relative min-h-dvh bg-background text-foreground">
            {/* Subtle ambient radial gradient */}
            <div
              className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:opacity-20"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.55 0.22 275 / 0.10), transparent)',
              }}
              aria-hidden
            />
            <TopNav />

            <div className="mx-auto flex max-w-[1400px] gap-0 px-4 lg:px-6">
              <aside className="hidden w-[240px] shrink-0 border-r border-border lg:block">
                <WikiSidebar nav={nav} />
              </aside>

              <div className="flex min-w-0 flex-1">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
