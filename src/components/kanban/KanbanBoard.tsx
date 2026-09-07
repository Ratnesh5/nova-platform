'use client';

import React, { useState } from 'react';
import { TaskData, TaskStatus, UserSummary } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { NewTaskModal } from './NewTaskModal';

interface KanbanBoardProps {
  projectId: string;
  tasks: TaskData[];
  availableUsers: UserSummary[];
  onTasksChanged: () => void;
  searchQuery?: string;
}

const COLUMNS: Array<{ status: TaskStatus; title: string; color: string }> = [
  { status: 'TODO', title: 'To Do', color: '#94a3b8' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: '#3b82f6' },
  { status: 'IN_REVIEW', title: 'In Review', color: '#a855f7' },
  { status: 'DONE', title: 'Done', color: '#10b981' },
];

export function KanbanBoard({
  projectId,
  tasks,
  availableUsers,
  onTasksChanged,
  searchQuery = '',
}: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('TODO');

  // Filter tasks based on searchQuery
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.assignee && t.assignee.name.toLowerCase().includes(q)) ||
      t.priority.toLowerCase().includes(q)
    );
  });

  const handleOpenAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setIsNewTaskOpen(true);
  };

  const handleMoveStatus = async (taskId: string, targetStatus: TaskStatus | string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      onTasksChanged();
    } catch (err) {
      console.error('Move status error:', err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Columns Container */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              tasks={colTasks}
              color={col.color}
              onTaskClick={(task) => setSelectedTask(task)}
              onAddTask={handleOpenAddTask}
              onTaskDrop={handleMoveStatus}
              onMoveQuick={handleMoveStatus}
            />
          );
        })}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={() => {
            onTasksChanged();
            // Refresh currently selected task
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

      {/* Create Task Modal */}
      <NewTaskModal
        projectId={projectId}
        isOpen={isNewTaskOpen}
        initialStatus={newTaskStatus}
        onClose={() => setIsNewTaskOpen(false)}
        onTaskCreated={onTasksChanged}
        availableUsers={availableUsers}
      />
    </div>
  );
}
