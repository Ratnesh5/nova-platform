'use client';

import React, { useEffect, useState } from 'react';
import { UserSummary } from '@/types';
import { TeamDirectory } from '@/components/team/TeamDirectory';
import { Users, Sparkles } from 'lucide-react';

export default function TeamPage() {
  const [users, setUsers] = useState<
    Array<UserSummary & { _count?: { assignedTasks?: number; projectMembers?: number } }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to load team members:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Team & Collaborators</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Directory of cross-functional team members, roles, and project capacity.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{users.length} Active Members</span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Loading team directory...</p>
        </div>
      ) : (
        <TeamDirectory users={users} />
      )}
    </div>
  );
}
