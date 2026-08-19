'use client';

import { motion } from 'framer-motion';

interface BarChartDatum {
  label: string;
  value: number;
  tone?: 'primary' | 'success' | 'warning' | 'error';
}

const GRADIENT_CLASSES: Record<string, string> = {
  primary: 'from-cyan-400 to-violet-500',
  success: 'from-emerald-400 to-cyan-400',
  warning: 'from-amber-400 to-rose-400',
  error: 'from-rose-400 to-pink-500',
};

const GLOW_CLASSES: Record<string, string> = {
  primary: 'shadow-cyan-500/20',
  success: 'shadow-emerald-500/20',
  warning: 'shadow-amber-500/20',
  error: 'shadow-rose-500/20',
};

export function BarChart({ data, height = 160 }: { data: BarChartDatum[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((item, index) => {
        const tone = item.tone ?? 'primary';
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span className="text-xs font-semibold text-slate-300 truncate w-full text-center">
              {item.value > 0 ? item.value.toLocaleString() : ''}
            </span>
            <div className="w-full flex justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(4, (item.value / max) * 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-gradient-to-t ${GRADIENT_CLASSES[tone]} rounded-t-lg w-full max-w-12 shadow-lg ${GLOW_CLASSES[tone]}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 truncate w-full text-center">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  const gradientMap: Record<string, string> = {
    'bg-primary': 'from-cyan-400 to-cyan-500',
    'bg-success': 'from-emerald-400 to-emerald-500',
    'bg-warning': 'from-amber-400 to-amber-500',
    'bg-error': 'from-rose-400 to-rose-500',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 truncate text-slate-300">{label}</span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full bg-gradient-to-r ${gradientMap[tone] ?? 'from-cyan-400 to-cyan-500'} rounded-full`}
        />
      </div>
      <span className="text-xs font-semibold w-12 text-right text-slate-300">{value.toLocaleString()}</span>
    </div>
  );
}
