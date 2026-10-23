"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Wallet } from "lucide-react";
import type { Loan } from "@/types";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge, LoanTypeBadge } from "./StatusBadge";

interface LoanCardProps {
  loan: Loan;
  actions?: React.ReactNode;
  highlight?: boolean;
}

export function LoanCard({ loan, actions, highlight = false }: LoanCardProps) {
  const progress =
    loan.amount > 0
      ? Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)
      : 0;
  const days = daysUntil(loan.dueDate);

  return (
    <Link href={`/loans/${loan.id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`glass-card p-5 h-full cursor-pointer relative overflow-hidden ${
          highlight ? "border-rose-500/35 glow-rose" : ""
        }`}
      >
        {highlight && (
          <div className="absolute inset-x-0 -top-12 h-24 bg-gradient-to-br from-rose-500/18 to-transparent blur-2xl" />
        )}
        {!highlight && (
          <div className="absolute inset-x-0 -top-12 h-24 bg-gradient-to-br from-cyan-500/12 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate group-hover:text-cyan-200 transition-colors">
                {loan.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                {formatCurrency(loan.remainingAmount)} remaining of{" "}
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <StatusBadge status={loan.status} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <LoanTypeBadge loanType={loan.loanType} />
            {loan.user && (
              <span className="text-xs text-slate-400 bg-white/5 rounded-full px-2.5 py-0.5">
                {loan.user.name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CalendarDays className="w-3.5 h-3.5" />
              Due {formatDate(loan.dueDate)}
              {days !== null && days >= 0 && (
                <span className="text-slate-500">({days}d left)</span>
              )}
              {days !== null && days < 0 && (
                <span className="text-rose-400">{Math.abs(days)}d overdue</span>
              )}
            </span>
            <span className="text-slate-500">
              {loan._count?.transactions ?? 0} payments
            </span>
          </div>

          <div className="w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${
                progress === 100
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : "bg-gradient-to-r from-cyan-400 to-violet-400"
              }`}
            />
          </div>
          {actions && <div className="mt-1">{actions}</div>}
        </div>
      </motion.div>
    </Link>
  );
}
