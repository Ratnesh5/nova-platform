'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProjectData, UserSummary } from '@/types';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskListTable } from '@/components/tasks/TaskListTable';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { NewTaskModal } from '@/components/kanban/NewTaskModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import {
  Kanban,
  List,
  BarChart2,
  Users,
  History,
  Settings,
  Plus,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Save,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'kanban' | 'list' | 'analytics' | 'members' | 'activity' | 'settings';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserSummary[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Settings form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNewMember, setSelectedNewMember] = useState('');

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    try {
      const [projRes, usersRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch('/api/users'),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        setProject(pData.project);
        setEditTitle(pData.project.title || '');
        setEditDescription(pData.project.description || '');
        setEditCategory(pData.project.category || 'Engineering');
        setEditPriority(pData.project.priority || 'MEDIUM');
        setEditBudget(pData.project.budget ? String(pData.project.budget) : '0');
      }

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setAvailableUsers(uData.users || []);
      }
    } catch (err) {
      console.error('Failed to load project workspace:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory,
          priority: editPriority,
          budget: editBudget ? parseFloat(editBudget) : 0,
        }),
      });
      if (res.ok) {
        fetchProjectData();
        alert('Project settings saved!');
      }
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/projects');
      }
    } catch (err) {
      console.error('Delete project error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Add Member
  const handleAddMember = async () => {
    if (!selectedNewMember) return;
    try {
      await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedNewMember, role: 'CONTRIBUTOR' }),
      });
      setSelectedNewMember('');
      fetchProjectData();
    } catch (err) {
      console.error('Add member error:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-400">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-200">Project Not Found</h2>
        <p className="text-xs text-slate-400">The requested project could not be located.</p>
        <Link href="/projects">
          <Button variant="primary" size="sm">
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const members = project.members?.map((m) => m.user) || [];
  const metrics = project.taskMetrics || {
    total: 0,
    completed: 0,
    inProgress: 0,
    inReview: 0,
    todo: 0,
    completionPercentage: 0,
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ElementType; count?: number }> = [
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'list', label: 'List View', icon: List, count: project.tasks?.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'members', label: 'Team Members', icon: Users, count: members.length },
    { id: 'activity', label: 'Activity Feed', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Back link & Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsNewTaskOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      {/* Project Overview Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: project.color || '#6366f1' }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: `${project.color}15`,
                  color: project.color,
                  borderColor: `${project.color}35`,
                }}
              >
                {project.key}
              </span>
              <Badge variant="priority" value={project.priority}>
                {project.priority}
              </Badge>
              <Badge variant="neutral">{project.category}</Badge>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">{project.title}</h1>
            {project.description && (
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{project.description}</p>
            )}
          </div>

          {/* Quick Metrics & Team */}
          <div className="flex flex-wrap items-center gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${metrics.completionPercentage}%`,
                      backgroundColor: project.color || '#6366f1',
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-200">{metrics.completionPercentage}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Deadline</span>
              <div className="flex items-center gap-1 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(project.dueDate)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Team</span>
              <AvatarGroup users={members} max={4} size="sm" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {/* Tab 1: KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <KanbanBoard
            projectId={project.id}
            tasks={project.tasks || []}
            availableUsers={availableUsers}
            onTasksChanged={fetchProjectData}
            searchQuery={searchQuery}
          />
        )}

        {/* Tab 2: LIST VIEW */}
        {activeTab === 'list' && (
          <TaskListTable
            tasks={project.tasks || []}
            availableUsers={availableUsers}
            onTasksChanged={fetchProjectData}
            searchQuery={searchQuery}
          />
        )}

        {/* Tab 3: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Total Work Items</span>
                <p className="text-2xl font-bold text-slate-100 mt-1">{project.tasks?.length || 0}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Completed Tasks</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.completed}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Active Budget</span>
                <p className="text-2xl font-bold text-indigo-400 mt-1">
                  ${project.budget?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Task breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Project Stage Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'To Do', count: metrics.todo, color: 'bg-slate-400' },
                  { label: 'In Progress', count: metrics.inProgress, color: 'bg-blue-500' },
                  { label: 'In Review', count: metrics.inReview, color: 'bg-purple-500' },
                  { label: 'Done', count: metrics.completed, color: 'bg-emerald-500' },
                ].map((st) => (
                  <div key={st.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{st.label}</span>
                      <span className="text-slate-400">
                        {st.count} tasks ({metrics.total > 0 ? Math.round((st.count / metrics.total) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${st.color} transition-all duration-300`}
                        style={{
                          width: `${metrics.total > 0 ? (st.count / metrics.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Add Member Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedNewMember}
                onChange={(e) => setSelectedNewMember(e.target.value)}
                className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">Select team member to assign to project...</option>
                {availableUsers
                  .filter((u) => !members.some((m) => m.id === u.id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.title} ({u.department})
                    </option>
                  ))}
              </select>

              <Button
                variant="primary"
                size="sm"
                onClick={handleAddMember}
                disabled={!selectedNewMember}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Member
              </Button>
            </div>

            {/* Member List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members?.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={member.user.name} src={member.user.avatarUrl} size="md" showStatus />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{member.user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{member.user.title}</p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700 shrink-0">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Project Activity Trail</h3>
            <ActivityFeed activities={project.activities || []} />
          </div>
        )}

        {/* Tab 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100">Project Settings</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Budget ($)</label>
                <input
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isSavingSettings}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Danger Zone</h4>
              <p className="text-xs text-slate-400">
                Permanently delete this project, all associated tasks, checklists, and comments.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteProject}
                loading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Project Workspace
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <NewTaskModal
        projectId={project.id}
        isOpen={isNewTaskOpen}
        initialStatus="TODO"
        onClose={() => setIsNewTaskOpen(false)}
        onTaskCreated={fetchProjectData}
        availableUsers={availableUsers}
      />
    </div>
  );
}
