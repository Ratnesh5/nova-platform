import React from 'react';
import { cn, getPriorityColor, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'priority' | 'status' | 'custom' | 'neutral';
  value?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', value, className, size = 'sm' }: BadgeProps) {
  let styleClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let dotColor = 'bg-slate-400';

  if (variant === 'priority' && value) {
    const pStyle = getPriorityColor(value);
    styleClasses = pStyle.badge;
    dotColor = pStyle.dot;
  } else if (variant === 'status' && value) {
    const sStyle = getStatusColor(value);
    styleClasses = sStyle.badge;
    dotColor = sStyle.dot;
  }

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1.5' : 'text-xs px-2.5 py-1 gap-2';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border shadow-xs select-none tracking-wide capitalize',
        sizeClasses,
        styleClasses,
        className
      )}
    >
      {(variant === 'priority' || variant === 'status') && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />
      )}
      {children}
    </span>
  );
}
