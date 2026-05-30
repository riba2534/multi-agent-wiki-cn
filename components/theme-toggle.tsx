'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/useMounted';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="切换主题"
      className="relative size-9 rounded-lg text-muted-foreground transition-all duration-300 hover:bg-accent/60 hover:text-foreground hover:shadow-sm"
    >
      <Sun className="size-[18px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[18px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}