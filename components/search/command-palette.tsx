'use client';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search, Hash, CornerDownLeft } from 'lucide-react';
import { useUI } from '@/components/providers/ui-provider';
import { CATEGORY_HEX } from '@/lib/pattern-map';
import type { SearchEntry } from '@/lib/search-index';

const GROUP_ORDER = ['总览', '模式', '实现指南', '参考'] as const;

export function CommandPalette({ index }: { index: SearchEntry[] }) {
  const { searchOpen, setSearchOpen } = useUI();
  const router = useRouter();

  const go = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  const grouped = GROUP_ORDER.map(g => ({
    group: g,
    items: index.filter(e => e.group === g),
  })).filter(x => x.items.length > 0);

  const sections = index.flatMap(e =>
    e.headings.map(h => ({
      key: e.href + h.hash,
      href: e.href + h.hash,
      doc: e.title,
      label: h.label,
      category: e.category,
    })),
  );

  return (
    <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-label="搜索文档"
          className="fixed left-1/2 top-[14vh] z-[101] w-[92vw] max-w-[620px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2"
        >
          <Dialog.Title className="sr-only">搜索文档</Dialog.Title>
          <Dialog.Description className="sr-only">搜索模式、实现指南与章节</Dialog.Description>

          <Command shouldFilter loop label="搜索文档" className="flex flex-col">
            <div className="flex items-center gap-2.5 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <Command.Input
                autoFocus
                placeholder="搜索模式、实现指南、章节…"
                aria-label="搜索文档"
                className="h-12 flex-1 bg-transparent text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[58vh] overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="px-3 py-10 text-center text-[13px] text-muted-foreground">
                没有找到相关内容
              </Command.Empty>

              {grouped.map(({ group, items }) => (
                <Command.Group key={group} heading={group}>
                  {items.map(e => (
                    <Command.Item
                      key={e.href}
                      value={`${e.title} ${e.description ?? ''} ${e.category ?? ''} ${e.href}`}
                      onSelect={() => go(e.href)}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-foreground data-[selected=true]:bg-accent"
                    >
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ background: e.category ? CATEGORY_HEX[e.category] : 'var(--brand)' }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{e.title}</span>
                        {e.description && (
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {e.description}
                          </span>
                        )}
                      </span>
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-data-[selected=true]:opacity-100" />
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}

              {sections.length > 0 && (
                <Command.Group heading="章节">
                  {sections.map(s => (
                    <Command.Item
                      key={s.key}
                      value={`${s.doc} ${s.label} ${s.href}`}
                      onSelect={() => go(s.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-muted-foreground data-[selected=true]:bg-accent data-[selected=true]:text-foreground"
                    >
                      <Hash className="size-3.5 shrink-0 opacity-60" />
                      <span className="min-w-0 flex-1 truncate">{s.label}</span>
                      <span className="shrink-0 truncate text-[11px] text-muted-foreground/70">{s.doc}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
