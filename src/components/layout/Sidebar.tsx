'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Sparkles, 
  PlusCircle, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  onOpenNewProject?: () => void;
  onResetSeed?: () => void;
  isResetting?: boolean;
}

export function Sidebar({ onOpenNewProject, onResetSeed, isResetting }: SidebarProps) {
  const pathname = usePathname();
  const { user, demoLogin } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { label: 'Team & Roles', href: '/team', icon: Users },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-950/90 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                NOVA
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Plan • Collaborate • Deliver</p>
          </div>
        </Link>
      </div>

      {/* Quick Action: New Project Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onOpenNewProject}
          className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />}
            </Link>
          );
        })}

        {/* Demo Persona Switcher Section */}
        <div className="pt-6 pb-2 px-3">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Switch Persona
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {[
              { role: 'ADMIN', name: 'Alex (Lead)', color: 'border-indigo-500/30' },
              { role: 'FRONTEND', name: 'Sarah (Frontend)', color: 'border-cyan-500/30' },
              { role: 'DESIGNER', name: 'Elena (Design)', color: 'border-pink-500/30' },
            ].map((p) => (
              <button
                key={p.role}
                onClick={() => demoLogin(p.role)}
                className={cn(
                  'w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between border cursor-pointer',
                  user?.name.startsWith(p.name.split(' ')[0])
                    ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800/60'
                )}
              >
                <span>{p.name}</span>
                {user?.name.startsWith(p.name.split(' ')[0]) && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Active</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Reset DB & User Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/95 space-y-2">
        <button
          onClick={onResetSeed}
          disabled={isResetting}
          className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Reset sample database to default state"
        >
          <RotateCcw className={cn('w-3 h-3', isResetting && 'animate-spin text-indigo-400')} />
          <span>{isResetting ? 'Resetting Data...' : 'Reset Sample Data'}</span>
        </button>

        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Avatar name={user.name} src={user.avatarUrl} size="sm" showStatus />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.title || user.role}</p>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center transition-colors"
          >
            Sign In / Demo
          </Link>
        )}
      </div>
    </aside>
  );
}
