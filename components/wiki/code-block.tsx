'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  lang?: string;
  source: string;
  children: React.ReactNode;
}

const LANG_LABEL: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  py: 'Python',
  python: 'Python',
  sh: 'Shell',
  bash: 'Bash',
  zsh: 'Shell',
  yaml: 'YAML',
  yml: 'YAML',
  json: 'JSON',
  md: 'Markdown',
  markdown: 'Markdown',
  sql: 'SQL',
  go: 'Go',
  rust: 'Rust',
  text: 'Text',
  plain: 'Text',
  txt: 'Text',
};

/**
 * Frame a fenced code block with a small header (language label + copy
 * button) and a dark body. Keeps non-mermaid code blocks from looking like
 * naked text dumps inside an otherwise polished article body.
 */
export function CodeBlock({ lang, source, children }: Props) {
  const [copied, setCopied] = useState(false);
  const label = lang ? (LANG_LABEL[lang.toLowerCase()] ?? lang.toUpperCase()) : '代码';

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 shadow-lg shadow-zinc-950/20">
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/70 px-4 py-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? '已复制' : '复制代码'}
          className={cn(
            'inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[10px] font-medium transition-all duration-200',
            copied
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:scale-95',
          )}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span className="hidden sm:inline">{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      {children}
    </div>
  );
}
