import { WikiSidebar } from '@/components/wiki/sidebar';
import { getNav } from '@/lib/wiki-nav';

/**
 * Layout for documentation routes (everything except the landing cover at `/`).
 * Owns the centered max-width column + the persistent desktop sidebar, so the
 * home page — which lives directly under the root layout — can render the
 * full-bleed cover without a sidebar. The sidebar persists across navigation
 * within this group, preserving its scroll position.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getNav();
  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-4 lg:px-6">
      <aside className="hidden w-[240px] shrink-0 border-r border-border lg:block">
        <WikiSidebar nav={nav} />
      </aside>

      <div className="flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
