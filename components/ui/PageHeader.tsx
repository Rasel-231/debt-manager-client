import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  eyebrow?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  eyebrow,
  action,
}: PageHeaderProps) {
  return (
    <motion.header
      variants={fadeInUp}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <span className="hidden sm:inline-flex shrink-0 p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/18 to-violet-500/12 ring-1 ring-white/8">
            <Icon className="w-5 h-5 text-cyan-300" />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-400/80 font-semibold mb-1.5">
              {eyebrow}
            </p>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white break-words">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">{description}</p>
          )}
        </div>
      </div>

      {action && <div className="flex-shrink-0 w-full sm:w-auto">{action}</div>}
    </motion.header>
  );
}
