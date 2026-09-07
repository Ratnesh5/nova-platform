'use client';

import React, { useState } from 'react';
import { cn, getAvatarColor, getInitials } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  statusColor?: string;
}

export function Avatar({ name, src, size = 'md', className, showStatus = false, statusColor = 'bg-emerald-500' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeDimensions = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  const bgGradient = getAvatarColor(name || 'User');
  const initials = getInitials(name || 'User');

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold ring-1 ring-white/10 shadow-sm',
          sizeDimensions[size],
          bgGradient
        )}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={name || 'Avatar'}
            width={56}
            height={56}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {showStatus && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-slate-900',
            statusDotSizes[size],
            statusColor
          )}
        />
      )}
    </div>
  );
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: { users: Array<{ name: string; avatarUrl?: string | null }>; max?: number; size?: 'xs' | 'sm' | 'md' }) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {visible.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.avatarUrl} size={size} className="ring-2 ring-slate-900" />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-slate-800 text-slate-300 ring-2 ring-slate-900 flex items-center justify-center font-semibold text-[11px]',
            size === 'xs' ? 'w-6 h-6' : size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
