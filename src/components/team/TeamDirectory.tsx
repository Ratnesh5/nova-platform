'use client';

import React from 'react';
import { UserSummary } from '@/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Mail, CheckCircle2, ListTodo } from 'lucide-react';

interface TeamDirectoryProps {
  users: Array<UserSummary & { _count?: { assignedTasks?: number; projectMembers?: number } }>;
}

export function TeamDirectory({ users }: TeamDirectoryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((member) => (
        <div
          key={member.id}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 shadow-lg flex flex-col justify-between group"
        >
          {/* Top Profile */}
          <div className="flex items-start gap-3.5">
            <Avatar name={member.name} src={member.avatarUrl} size="lg" showStatus />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                  {member.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{member.title || 'Member'}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant="neutral" size="sm" className="bg-slate-800 text-indigo-400 border-slate-700">
                  {member.department || 'Engineering'}
                </Badge>
                <span className="text-[10px] uppercase font-bold text-slate-400">{member.role}</span>
              </div>
            </div>
          </div>

          {/* Email & Task Metrics */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[150px]"
            >
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{member.email}</span>
            </a>

            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
              <span className="flex items-center gap-1">
                <ListTodo className="w-3 h-3 text-indigo-400" />
                <span>{member._count?.assignedTasks || 0} tasks</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>{member._count?.projectMembers || 0} proj</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
