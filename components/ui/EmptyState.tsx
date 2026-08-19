import { motion } from 'framer-motion';
import { FolderSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fadeInUp } from '@/lib/motion';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-12 text-center gap-4"
    >
      <span className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <Icon className="w-8 h-8 text-slate-500" />
      </span>
      <div>
        <p className="font-semibold text-white">{title}</p>
        {description && (
          <p className="text-sm text-slate-400 max-w-sm mt-1">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
