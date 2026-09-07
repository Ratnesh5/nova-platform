'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ProjectCreateModal } from '@/components/projects/ProjectCreateModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetSeed = async () => {
    if (!confirm('Reset database with fresh sample projects, tasks, and users?')) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Seed reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global New Project Modal */}
      <ProjectCreateModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onProjectCreated={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
