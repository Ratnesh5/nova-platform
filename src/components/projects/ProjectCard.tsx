'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ListTodo, ArrowUpRight } from 'lucide-react';
import { ProjectData } from '@/types';
import { Badge } from '../ui/Badge';
import { AvatarGroup } from '../ui/Avatar';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const metrics = project.taskMetrics || {
    total: 0,
    completed: 0,
    inProgress: 0,
    completionPercentage: 0,
  };

  const members = project.members?.map((m) => m.user) || [];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
        style={{ backgroundColor: project.color || '#6366f1' }}
      />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border"
              style={{
                backgroundColor: `${project.color}15`,
                color: project.color,
                borderColor: `${project.color}35`,
              }}
            >
              {project.key}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{project.category}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </div>

        <div className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
          {project.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[11px] text-slate-400 font-medium">Progress</span>
          <span className="text-xs font-bold text-slate-200">{metrics.completionPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${metrics.completionPercentage}%`,
              backgroundColor: project.color || '#6366f1',
            }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <ListTodo className="w-3.5 h-3.5 text-slate-400" />
            <span>{metrics.total} tasks</span>
          </span>
          {metrics.completed > 0 && (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics.completed} done</span>
            </span>
          )}
        </div>

        <AvatarGroup users={members} max={3} size="xs" />
      </div>

      {/* Due Date & Priority */}
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
        <Badge variant="priority" value={project.priority} size="sm">
          {project.priority}
        </Badge>
      </div>
    </Link>
  );
}
