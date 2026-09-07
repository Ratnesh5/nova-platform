'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TaskStatus, UserSummary } from '@/types';
import { Sparkles, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

interface NewTaskModalProps {
  projectId: string;
  isOpen: boolean;
  initialStatus: TaskStatus;
  onClose: () => void;
  onTaskCreated: () => void;
  availableUsers: UserSummary[];
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function NewTaskModal({
  projectId,
  isOpen,
  initialStatus = 'TODO',
  onClose,
  onTaskCreated,
  availableUsers,
}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [currentSubtask, setCurrentSubtask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSubtask = () => {
    if (currentSubtask.trim()) {
      setSubtasks([...subtasks, currentSubtask.trim()]);
      setCurrentSubtask('');
    }
  };

  const handleRemoveSubtask = (idx: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title,
          description,
          status,
          priority,
          assigneeId: assigneeId || null,
          dueDate: dueDate || null,
          estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0,
          subtasks: subtasks.map((st) => ({ title: st, completed: false })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create task');
      }

      // Reset
      setTitle('');
      setDescription('');
      setSubtasks([]);
      setAssigneeId('');
      setDueDate('');
      setEstimatedHours('');
      onTaskCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a task, checklist items, and assign team owners."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Requirements, acceptance criteria, relevant links..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-all"
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Initial Column</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 capitalize"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Unassigned</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.title || u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400" /> Target Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Estimated Hours */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Estimated Work Hours
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            placeholder="e.g. 8"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Checklist Subtasks */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-300">Subtask Checklist</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentSubtask}
              onChange={(e) => setCurrentSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="e.g. Write integration test suite"
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Button type="button" size="sm" variant="secondary" onClick={handleAddSubtask}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-1 mt-2">
              {subtasks.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-300"
                >
                  <span>• {st}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" size="sm" loading={loading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
