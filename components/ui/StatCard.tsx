import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { fadeInUp } from '@/lib/motion';

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  loading?: boolean;
}

const TONE_CONFIG = {
  default: {
    iconBg: 'bg-slate-500/15',
    iconColor: 'text-slate-400',
    glow: '',
    accent: 'from-slate-500/20 to-slate-600/10',
  },
  primary: {
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    glow: 'glow-cyan',
    accent: 'from-cyan-500/20 to-violet-500/10',
  },
  success: {
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    glow: 'glow-emerald',
    accent: 'from-emerald-500/20 to-cyan-500/10',
  },
  warning: {
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    glow: 'glow-amber',
    accent: 'from-amber-500/20 to-rose-500/10',
  },
  error: {
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    glow: 'glow-rose',
    accent: 'from-rose-500/20 to-pink-500/10',
  },
};

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = 'default',
  loading = false,
}: StatCardProps) {
  const config = TONE_CONFIG[tone];

  return (
    <motion.div
      variants={fadeInUp}
      className={`glass-card p-5 relative overflow-hidden ${config.glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.accent} opacity-50`} />
      <div className="relative flex items-center gap-4">
        <span className={`p-3 rounded-xl ${config.iconBg}`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{label}</p>
          {loading ? (
            <div className="skeleton h-7 w-24 mt-1.5 rounded-lg" />
          ) : (
            <p className="text-2xl font-bold text-white truncate">{value}</p>
          )}
          {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
        </div>
      </div>
    </motion.div>
  );
}
