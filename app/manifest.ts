import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: '多智能体百科',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    // Match the dark themeColor declared in app/layout.tsx's viewport so the
    // installed PWA chrome/splash is consistent with the site.
    background_color: '#1a1625',
    theme_color: '#1a1625',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
