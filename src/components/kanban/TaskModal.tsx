'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { TaskData, UserSummary } from '@/types';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  CheckSquare, 
  Plus, 
  Send, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/lib/utils';

interface TaskModalProps {
  task: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  availableUsers: UserSummary[];
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export function TaskModal({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  availableUsers,
}: TaskModalProps) {
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  // Update field helper
  const handleUpdateField = async (field: string, value: unknown) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (subtaskId: string, currentCompleted: boolean) => {
    try {
      await fetch(`/api/tasks/${task.id}/subtasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtaskId, completed: !currentCompleted }),
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Subtask toggle error:', err);
    }
  };

  // Add subtask
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;

    setIsAddingSubtask(true);
    try {
      await fetch(`/api/tasks/${task.id}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: subtaskTitle }),
      });
      setSubtaskTitle('');
      onTaskUpdated();
    } catch (err) {
      console.error('Add subtask error:', err);
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // Delete subtask
  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await fetch(`/api/tasks/${task.id}/subtasks?subtaskId=${subtaskId}`, {
        method: 'DELETE',
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Delete subtask error:', err);
    }
  };

  // Post comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsPostingComment(true);
    try {
      await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      setCommentText('');
      onTaskUpdated();
    } catch (err) {
      console.error('Post comment error:', err);
    } finally {
      setIsPostingComment(false);
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      onTaskUpdated();
      onClose();
    } catch (err) {
      console.error('Delete task error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {task.project?.key}-{task.order + 1}
              </span>
              <Badge variant="status" value={task.status}>
                {task.status.replace('_', ' ')}
              </Badge>
              <Badge variant="priority" value={task.priority}>
                {task.priority}
              </Badge>
            </div>

            <h2 className="text-lg font-bold text-slate-100">{task.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Details, Subtasks, Comments) */}
          <div className="md:col-span-2 space-y-5">
            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Subtasks Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Subtasks</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  {task.subtasks?.filter((s) => s.completed).length || 0} / {task.subtasks?.length || 0}
                </span>
              </div>

              {/* Subtask list */}
              <div className="space-y-1.5">
                {task.subtasks?.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700/80 group transition-colors"
                  >
                    <label className="flex items-center gap-2.5 flex-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id, subtask.completed)}
                        className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`text-xs transition-all ${
                          subtask.completed ? 'line-through text-slate-400' : 'text-slate-200'
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </label>

                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add Subtask Form */}
                <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    placeholder="Add a checklist step..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="submit" size="sm" variant="secondary" loading={isAddingSubtask}>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </Button>
                </form>
              </div>
            </div>

            {/* Comments Stream */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Team Discussion & Updates
              </h4>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a message or update..."
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" size="sm" variant="primary" loading={isPostingComment}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>

              {/* Comments list */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex gap-3">
                    <Avatar name={comment.user.name} src={comment.user.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{comment.user.name}</span>
                        <span className="text-[10px] text-slate-400">{formatRelativeDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {(!task.comments || task.comments.length === 0) && (
                  <p className="text-[11px] text-slate-400 italic">No comments yet. Start the conversation!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Status, Priority, Assignee, Metadata Controls) */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 h-fit">
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Status
              </label>
              <select
                value={task.status}
                onChange={(e) => handleUpdateField('status', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => handleUpdateField('priority', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Assignee</label>
              <select
                value={task.assigneeId || ''}
                onChange={(e) => handleUpdateField('assigneeId', e.target.value || null)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Unassigned</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title || u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pink-400" /> Due Date
              </label>
              <input
                type="date"
                defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleUpdateField('dueDate', e.target.value || null)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Estimated Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Est. Hours
              </label>
              <input
                type="number"
                min={0}
                defaultValue={task.estimatedHours || 0}
                onBlur={(e) => handleUpdateField('estimatedHours', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Delete Task Button */}
            <div className="pt-4 border-t border-slate-800">
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={handleDeleteTask}
                loading={isDeleting}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
