'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inputWithIconClass } from './Field';

interface SearchToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SearchToolbar({
  search,
  onSearchChange,
  onSearchSubmit,
  placeholder = 'Search...',
  children,
  className,
}: SearchToolbarProps) {
  return (
    <div className={cn('flex flex-col lg:flex-row gap-3', className)}>
      <div className="relative flex-1 min-w-0">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          aria-hidden
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(inputWithIconClass, 'pr-10')}
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onSearchSubmit();
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {children && (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 lg:flex-none">
          {children}
        </div>
      )}
    </div>
  );
}

export const selectClass =
  'w-full sm:w-auto rounded-xl border border-white/10 bg-white/4 px-3.5 py-2.5 text-sm text-white appearance-none transition-all focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10 focus:outline-none cursor-pointer';
