import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'No due date';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function getPriorityColor(priority: string) {
  switch (priority?.toUpperCase()) {
    case 'URGENT':
      return {
        bg: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
        dot: 'bg-rose-500',
        badge: 'text-rose-400 bg-rose-950/40 border-rose-800/50',
      };
    case 'HIGH':
      return {
        bg: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
        dot: 'bg-amber-500',
        badge: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
        dot: 'bg-blue-500',
        badge: 'text-blue-400 bg-blue-950/40 border-blue-800/50',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        dot: 'bg-slate-400',
        badge: 'text-slate-400 bg-slate-900/60 border-slate-700/50',
      };
  }
}

export function getStatusColor(status: string) {
  switch (status?.toUpperCase()) {
    case 'DONE':
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500',
        badge: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
        label: 'Completed',
      };
    case 'IN_REVIEW':
      return {
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        dot: 'bg-purple-500',
        badge: 'text-purple-400 bg-purple-950/40 border-purple-800/50',
        label: 'In Review',
      };
    case 'IN_PROGRESS':
      return {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-500',
        badge: 'text-blue-400 bg-blue-950/40 border-blue-800/50',
        label: 'In Progress',
      };
    case 'PLANNING':
    case 'TODO':
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        dot: 'bg-slate-400',
        badge: 'text-slate-400 bg-slate-900/60 border-slate-700/50',
        label: 'To Do',
      };
  }
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
    'bg-gradient-to-br from-cyan-500 to-blue-600 text-white',
    'bg-gradient-to-br from-emerald-500 to-teal-700 text-white',
    'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
    'bg-gradient-to-br from-pink-500 to-rose-600 text-white',
    'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getInitials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
