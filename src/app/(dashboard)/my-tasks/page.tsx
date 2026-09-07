'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { TaskData, UserSummary } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { TaskModal } from '@/components/kanban/TaskModal';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { CheckSquare, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserSummary[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      const url = user?.id ? `/api/tasks?assigneeId=${user.id}` : '/api/tasks';
      const [tasksRes, usersRes] = await Promise.all([fetch(url), fetch('/api/users')]);

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks || []);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setAvailableUsers(uData.users || []);
      }
    } catch (err) {
      console.error('Failed to load my tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            <span>My Assigned Tasks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Focus on your active sprint deliverables and checklist milestones.
          </p>
        </div>

        {/* Task Counter */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="text-emerald-400 font-bold">{completedCount}</span> / {tasks.length} Completed
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-fit overflow-x-auto">
        {['ALL', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === s
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Loading tasks...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
            const totalSubtasks = task.subtasks?.length || 0;

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-lg"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-bold px-2 py-1 rounded bg-slate-950 text-indigo-400 border border-slate-800 shrink-0">
                    {task.project?.key}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{task.project?.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {totalSubtasks > 0 && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{completedSubtasks}/{totalSubtasks} steps</span>
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(task.dueDate)}</span>
                  </span>

                  {task.estimatedHours ? (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.estimatedHours}h</span>
                    </span>
                  ) : null}

                  <Badge variant="priority" value={task.priority} size="sm">
                    {task.priority}
                  </Badge>
                  <Badge variant="status" value={task.status} size="sm">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
          <CheckSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No Tasks in this Filter</h3>
          <p className="text-xs text-slate-400">You are all caught up on this stage.</p>
        </div>
      )}

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={() => {
            fetchMyTasks();
            fetch(`/api/tasks/${selectedTask.id}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.task) setSelectedTask(data.task);
              })
              .catch(() => setSelectedTask(null));
          }}
          availableUsers={availableUsers}
        />
      )}
    </div>
  );
}
