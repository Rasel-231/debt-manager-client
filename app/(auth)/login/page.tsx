"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/providers/auth-provider";
import { getErrorMessage } from "@/lib/utils";
import { MOTION_PAGE, MOTION_ITEM, MOTION_STAGGER } from "@/lib/motion";
import { Field, inputWithIconClass } from "@/components/ui/Field";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const next = searchParams.get("next");
    try {
      await login(email, password, next || undefined);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div {...MOTION_PAGE}>
      <motion.div {...MOTION_STAGGER} className="flex flex-col gap-6">
        <motion.div variants={MOTION_ITEM} className="text-center space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400/80">
            Welcome back
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Sign in to Debt Manager
          </h1>
          <p className="text-sm text-slate-400">
            Log in to manage your loans, track repayments and stay on top of dues.
          </p>
        </motion.div>

        <motion.form
          variants={MOTION_ITEM}
          onSubmit={submit}
          className="flex flex-col gap-4"
        >
          <Field label="Email" htmlFor="email" icon={Mail}>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className={inputWithIconClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Password" htmlFor="password" icon={Lock}>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputWithIconClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Field>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-semibold text-white gradient-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </motion.form>

        <motion.p
          variants={MOTION_ITEM}
          className="text-center text-sm text-slate-400"
        >
          No account yet?{" "}
          <Link
            href="/register"
            className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
          >
            Create one
          </Link>
        </motion.p>

        {searchParams.get("next") && (
          <motion.p
            variants={MOTION_ITEM}
            className="text-center text-xs text-slate-500"
          >
            You will be redirected to your destination after login.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8 text-slate-400">Loading...</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
