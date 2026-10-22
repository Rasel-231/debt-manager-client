import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  icon: Icon,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            aria-hidden
          />
        )}
        {children}
      </div>

      {error ? (
        <p className="text-xs text-rose-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10 focus:outline-none';

export const inputWithIconClass = `${inputClass} pl-10`;

export const selectClass = `${inputClass} appearance-none bg-[length:16px] bg-no-repeat bg-[right_0.9rem_center] pr-10`;
