'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskData, TaskStatus } from '@/types';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: TaskData[];
  color: string;
  onTaskClick: (task: TaskData) => void;
  onAddTask: (status: TaskStatus) => void;
  onTaskDrop: (taskId: string, targetStatus: TaskStatus) => void;
  onMoveQuick: (taskId: string, targetStatus: string) => void;
}

export function KanbanColumn({
  status,
  title,
  tasks,
  color,
  onTaskClick,
  onAddTask,
  onTaskDrop,
  onMoveQuick,
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskDrop(taskId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col rounded-2xl bg-slate-950/60 border p-3.5 min-w-[280px] max-w-[340px] flex-1 h-full min-h-[500px] transition-all duration-200',
        isOver
          ? 'border-indigo-500/80 bg-indigo-950/20 ring-2 ring-indigo-500/30'
          : 'border-slate-800/80'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{title}</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-300 border border-slate-700/60">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            onMoveQuick={onMoveQuick}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-400 text-xs gap-1">
            <span>No tasks in this stage</span>
            <button
              onClick={() => onAddTask(status)}
              className="text-[11px] text-indigo-400 hover:underline mt-1 cursor-pointer"
            >
              + Create one
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
