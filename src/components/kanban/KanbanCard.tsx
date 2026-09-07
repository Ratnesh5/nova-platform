'use client';

import React from 'react';
import { Calendar, CheckSquare, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { TaskData } from '@/types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '@/lib/utils';

interface KanbanCardProps {
  task: TaskData;
  onClick: (task: TaskData) => void;
  onMoveQuick?: (taskId: string, targetStatus: string) => void;
}

export function KanbanCard({ task, onClick, onMoveQuick }: KanbanCardProps) {
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const commentsCount = task.comments?.length || 0;

  const nextStatusMap: Record<string, string> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'IN_REVIEW',
    IN_REVIEW: 'DONE',
  };

  const nextStatus = nextStatusMap[task.status];

  return (
    <div
      onClick={() => onClick(task)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
      }}
      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-md shadow-black/30 transition-all duration-150 cursor-pointer group hover:-translate-y-0.5 select-none relative"
    >
      {/* Priority & Quick Move */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <Badge variant="priority" value={task.priority} size="sm">
          {task.priority}
        </Badge>

        {nextStatus && onMoveQuick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveQuick(task.id, nextStatus);
            }}
            title={`Move to ${nextStatus.replace('_', ' ')}`}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 font-normal leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtask Mini Bar */}
      {totalSubtasks > 0 && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            </span>
            <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer / Assignee, Due Date, Comments */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2.5">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDate(task.dueDate)}</span>
            </span>
          )}

          {task.estimatedHours ? (
            <span className="flex items-center gap-0.5 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedHours}h</span>
            </span>
          ) : null}

          {commentsCount > 0 && (
            <span className="flex items-center gap-0.5 text-indigo-400 font-medium">
              <MessageSquare className="w-3 h-3" />
              <span>{commentsCount}</span>
            </span>
          )}
        </div>

        {task.assignee ? (
          <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="xs" />
        ) : (
          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}
