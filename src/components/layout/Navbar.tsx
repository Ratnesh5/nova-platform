'use client';

import React, { useState } from 'react';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '../ui/Avatar';

interface NavbarProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export function Navbar({ title = 'NOVA Workspace', onSearch }: NavbarProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-100 tracking-tight">{title}</h1>
        <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ● Live Sync
        </span>
      </div>

      {/* Center / Search */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, tasks, members..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">Recent Notifications</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">3 New</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="font-semibold text-slate-200 text-[11px]">Task Completed</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Marcus completed &quot;Architect WebSocket Gateway&quot;</p>
                  <span className="text-[9px] text-slate-400 mt-1 block">10m ago</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="font-semibold text-slate-200 text-[11px]">New Comment</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Elena commented on &quot;Kanban Board Drag-and-Drop&quot;</p>
                  <span className="text-[9px] text-slate-400 mt-1 block">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-colors cursor-pointer"
            >
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              <span className="text-xs font-medium text-slate-200 hidden sm:inline-block max-w-[120px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-100">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {user.role}
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
