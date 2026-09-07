'use client';

import React from 'react';
import { ActivityLogData } from '@/types';
import { Avatar } from '../ui/Avatar';
import { formatRelativeDate } from '@/lib/utils';
import { CheckCircle2, PlusCircle, ArrowRight, MessageSquare, Layers } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityLogData[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TASK_COMPLETED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TASK_CREATED':
      case 'PROJECT_CREATED':
        return <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />;
      case 'TASK_MOVED':
        return <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  if (!activities || activities.length === 0) {
    return <p className="text-xs text-slate-400 italic py-4 text-center">No recent activity recorded.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
        >
          <div className="relative">
            <Avatar name={act.user.name} src={act.user.avatarUrl} size="sm" />
            <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-slate-800">
              {getActionIcon(act.action)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">{act.user.name}</span>
              <span className="text-[10px] text-slate-400">{formatRelativeDate(act.createdAt)}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{act.details}</p>
            {act.project && (
              <span className="inline-block text-[10px] font-mono mt-1 text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                {act.project.key}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
