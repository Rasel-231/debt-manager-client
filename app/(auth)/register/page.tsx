'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/providers/auth-provider';
import { getErrorMessage } from '@/lib/utils';
import { MOTION_PAGE, MOTION_ITEM, MOTION_STAGGER } from '@/lib/motion';
import { Field, inputWithIconClass } from '@/components/ui/Field';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
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
            Get started
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-400">
            Start tracking loans — cash with product or cash only.
          </p>
        </motion.div>

        <motion.form variants={MOTION_ITEM} onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Full name" htmlFor="name" icon={User}>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              className={inputWithIconClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </Field>

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

          <Field label="Password" htmlFor="password" icon={Lock} hint="Minimum 6 characters">
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputWithIconClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </Field>

          <Field label="Confirm password" htmlFor="confirmPassword" icon={Lock}>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputWithIconClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
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
              <UserPlus className="w-4 h-4" />
            )}
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </motion.form>

        <motion.p variants={MOTION_ITEM} className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
