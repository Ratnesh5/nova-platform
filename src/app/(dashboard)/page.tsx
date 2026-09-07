'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProjectData, TaskData, ActivityLogData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { 
  Sparkles, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  TrendingUp,
  ListTodo
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [recentTasks, setRecentTasks] = useState<TaskData[]>([]);
  const [activities, setActivities] = useState<ActivityLogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projRes, tasksRes, analyticsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks'),
          fetch('/api/analytics'),
        ]);

        if (projRes.ok) {
          const pData = await projRes.json();
          setProjects(pData.projects || []);
        }

        if (tasksRes.ok) {
          const tData = await tasksRes.json();
          setRecentTasks((tData.tasks || []).slice(0, 5));
        }

        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          setActivities(aData.recentActivities || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalTasks = projects.reduce((acc, p) => acc + (p.taskMetrics?.total || 0), 0);
  const completedTasks = projects.reduce((acc, p) => acc + (p.taskMetrics?.completed || 0), 0);
  const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-400">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>NOVA Team Productivity Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good day, {user?.name.split(' ')[0] || 'Team Lead'} 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Track multi-stage projects, coordinate sprint tasks, and deliver milestone achievements seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Projects</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-2">{projects.length}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>All on schedule</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completion Velocity</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-2">{overallRate}%</p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallRate}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Tasks</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-2">{totalTasks}</p>
          <p className="text-[11px] text-slate-400 mt-2">
            {completedTasks} completed • {totalTasks - completedTasks} remaining
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Platform Status</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optimal</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-2">Prisma SQLite &bull; JWT Authenticated</p>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">Featured Projects</h2>
            <p className="text-xs text-slate-400">Active team roadmaps and Kanban boards</p>
          </div>

          <Link
            href="/projects"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* 2-Column Section: Urgent Tasks & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sprint Priority Tasks */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Recent Priority Tasks</h3>
              <p className="text-xs text-slate-400">High impact items currently in flight</p>
            </div>
            <Link
              href="/my-tasks"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>My Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                    {task.project?.key}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{task.title}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Due {formatDate(task.dueDate)}</span>
                      {task.estimatedHours ? <span>• {task.estimatedHours}h est</span> : null}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="priority" value={task.priority} size="sm">
                    {task.priority}
                  </Badge>
                  <Badge variant="status" value={task.status} size="sm">
                    {task.status.replace('_', ' ')}
                  </Badge>
                  {task.assignee && (
                    <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="xs" />
                  )}
                </div>
              </div>
            ))}

            {recentTasks.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No tasks found.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Activity Stream */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Live Team Feed</h3>
            <p className="text-xs text-slate-400">Real-time status changes & updates</p>
          </div>

          <ActivityFeed activities={activities.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
