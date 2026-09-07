'use client';

import React, { useState } from 'react';
import { TaskData, TaskStatus, UserSummary } from '@/types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { TaskModal } from '../kanban/TaskModal';
import { formatDate } from '@/lib/utils';
import { Calendar, CheckSquare, Clock } from 'lucide-react';

interface TaskListTableProps {
  tasks: TaskData[];
  availableUsers: UserSummary[];
  onTasksChanged: () => void;
  searchQuery?: string;
}

export function TaskListTable({
  tasks,
  availableUsers,
  onTasksChanged,
  searchQuery = '',
}: TaskListTableProps) {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.assignee && t.assignee.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleQuickStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onTasksChanged();
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Table Shell */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Subtasks</th>
                <th className="py-3 px-4 text-right">Est. Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredTasks.map((task) => {
                const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
                const totalSubtasks = task.subtasks?.length || 0;

                return (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                      )}
                    </td>

                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => handleQuickStatusChange(task.id, e.target.value as TaskStatus)}
                        className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-slate-200 focus:outline-none capitalize"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="priority" value={task.priority} size="sm">
                        {task.priority}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="xs" />
                          <span className="text-xs truncate max-w-[110px]">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(task.dueDate)}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {totalSubtasks > 0 ? (
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{completedSubtasks}/{totalSubtasks}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {task.estimatedHours ? (
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.estimatedHours}h</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No tasks found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={() => {
            onTasksChanged();
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
