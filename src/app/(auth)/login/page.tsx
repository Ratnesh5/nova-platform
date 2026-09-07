'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid email or password. Or try the 1-Click Demo accounts below!');
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: string) => {
    setError('');
    setDemoLoading(role);
    const success = await demoLogin(role);
    if (success) {
      router.push('/');
    } else {
      setError('Failed to start demo session. Please try again.');
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 radial-gradient-bg relative overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-600/30 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">NOVA</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Plan • Collaborate • Deliver — Modern Project Management
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 rounded-3xl sm:px-10 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* 1-Click Instant Demo Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant 1-Click Demo Login
                </span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded font-semibold">
                  Evaluator Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose a persona to explore preloaded tasks, Kanban boards, and analytics:
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={!!demoLoading}
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600/80 border border-indigo-500/40 text-slate-200 text-center transition-all group cursor-pointer disabled:opacity-50"
                >
                  <p className="text-[11px] font-bold">Alex</p>
                  <p className="text-[9px] text-indigo-300 group-hover:text-white">Lead Admin</p>
                </button>

                <button
                  type="button"
                  disabled={!!demoLoading}
                  onClick={() => handleQuickDemo('FRONTEND')}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-600/80 border border-cyan-500/40 text-slate-200 text-center transition-all group cursor-pointer disabled:opacity-50"
                >
                  <p className="text-[11px] font-bold">Sarah</p>
                  <p className="text-[9px] text-cyan-300 group-hover:text-white">Frontend</p>
                </button>

                <button
                  type="button"
                  disabled={!!demoLoading}
                  onClick={() => handleQuickDemo('DESIGNER')}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-pink-600/80 border border-pink-500/40 text-slate-200 text-center transition-all group cursor-pointer disabled:opacity-50"
                >
                  <p className="text-[11px] font-bold">Elena</p>
                  <p className="text-[9px] text-pink-300 group-hover:text-white">Designer</p>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold absolute">
                Or Sign In With Email
              </span>
            </div>

            {/* Traditional Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@nova.io"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                  Create new workspace
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Enterprise-grade JWT Session Security</span>
        </div>
      </div>
    </div>
  );
}
