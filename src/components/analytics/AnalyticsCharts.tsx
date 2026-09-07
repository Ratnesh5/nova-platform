'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  TrendingUp, 
  Users, 
  FolderKanban 
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface AnalyticsData {
  overview: {
    totalProjects: number;
    totalTasks: number;
    totalUsers: number;
    completionRate: number;
    totalEstimatedHours: number;
    totalActualHours: number;
  };
  statusCounts: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
  };
  priorityCounts: {
    URGENT: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  workloadData: Array<{
    name: string;
    avatarUrl?: string | null;
    totalTasks: number;
    doneTasks: number;
    inProgressTasks: number;
  }>;
  projectPerformance: Array<{
    id: string;
    title: string;
    key: string;
    color: string;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  }>;
}

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const statusPieData = [
    { name: 'To Do', value: data.statusCounts.TODO, color: '#94a3b8' },
    { name: 'In Progress', value: data.statusCounts.IN_PROGRESS, color: '#3b82f6' },
    { name: 'In Review', value: data.statusCounts.IN_REVIEW, color: '#a855f7' },
    { name: 'Done', value: data.statusCounts.DONE, color: '#10b981' },
  ].filter((d) => d.value > 0);

  const priorityBarData = [
    { name: 'Urgent', count: data.priorityCounts.URGENT, fill: '#f43f5e' },
    { name: 'High', count: data.priorityCounts.HIGH, fill: '#f59e0b' },
    { name: 'Medium', count: data.priorityCounts.MEDIUM, fill: '#3b82f6' },
    { name: 'Low', count: data.priorityCounts.LOW, fill: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Projects</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-100 mt-2">{data.overview.totalProjects}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active workspaces</span>
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-100 mt-2">{data.overview.completionRate}%</p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${data.overview.completionRate}%` }}
            />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Work Items</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-100 mt-2">{data.overview.totalTasks}</p>
          <p className="text-[11px] text-slate-400 mt-2">
            {data.statusCounts.DONE} done • {data.statusCounts.IN_PROGRESS} in flight
          </p>
        </div>

        {/* Hours Logged */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Time Spent</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-100 mt-2">{data.overview.totalActualHours}h</p>
          <p className="text-[11px] text-slate-400 mt-2">
            of {data.overview.totalEstimatedHours}h estimated total
          </p>
        </div>
      </div>

      {/* Main 2-Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Donut Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Task Status Distribution
            </h3>
            <span className="text-xs text-slate-400 font-medium">{data.overview.totalTasks} tasks total</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}:</span>
                <span className="font-bold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Priority Urgency Matrix
            </h3>
            <span className="text-xs text-slate-400 font-medium">By task urgency</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>High & Urgent tasks: {data.priorityCounts.URGENT + data.priorityCounts.HIGH}</span>
            <span className="text-amber-400 font-medium">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Team Workload & Project Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Team Workload Distribution</span>
            </h3>
          </div>

          <div className="space-y-3.5">
            {data.workloadData.map((member) => (
              <div key={member.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar name={member.name} src={member.avatarUrl} size="xs" />
                    <span className="font-semibold text-slate-200">{member.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-bold">{member.doneTasks} done</span> /{' '}
                    <span>{member.totalTasks} total</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${member.totalTasks > 0 ? (member.doneTasks / member.totalTasks) * 100 : 0}%` }}
                    title="Done"
                  />
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${
                        member.totalTasks > 0 ? (member.inProgressTasks / member.totalTasks) * 100 : 0
                      }%`,
                    }}
                    title="In Progress"
                  />
                </div>
              </div>
            ))}

            {data.workloadData.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No assigned tasks yet.</p>
            )}
          </div>
        </div>

        {/* Project Health / Performance */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Project Progress Health</span>
            </h3>
          </div>

          <div className="space-y-3.5">
            {data.projectPerformance.map((proj) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${proj.color}15`,
                        color: proj.color,
                        borderColor: `${proj.color}35`,
                      }}
                    >
                      {proj.key}
                    </span>
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                      {proj.title}
                    </span>
                  </div>
                  <span className="font-bold text-slate-100">{proj.completionRate}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${proj.completionRate}%`,
                      backgroundColor: proj.color || '#6366f1',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
