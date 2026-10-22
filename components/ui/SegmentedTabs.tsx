'use client';

import { cn } from '@/lib/utils';

interface SegmentedTabsProps {
  items: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedTabs({ items, value, onChange, className }: SegmentedTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-1 p-1 rounded-2xl bg-white/4 border border-white/8 overflow-x-auto scrollbar-none',
        className
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex-1 sm:flex-none whitespace-nowrap px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
              active
                ? 'bg-gradient-to-br from-cyan-500/25 to-violet-500/20 text-white shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)] ring-1 ring-cyan-400/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                  active ? 'bg-white/15 text-white' : 'bg-white/8 text-slate-400'
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
