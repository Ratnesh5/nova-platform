'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { Button } from '@/components/ui/Button';
import { BarChart3, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    overview: {
      totalProjects: number;
      totalTasks: number;
      totalUsers: number;
      completionRate: number;
      totalEstimatedHours: number;
      totalActualHours: number;
    };
    statusCounts: {
      TODO: number;
      IN_PROGRESS: number;
      IN_REVIEW: number;
      DONE: number;
    };
    priorityCounts: {
      URGENT: number;
      HIGH: number;
      MEDIUM: number;
      LOW: number;
    };
    workloadData: Array<{
      name: string;
      avatarUrl?: string | null;
      totalTasks: number;
      doneTasks: number;
      inProgressTasks: number;
    }>;
    projectPerformance: Array<{
      id: string;
      title: string;
      key: string;
      color: string;
      totalTasks: number;
      completedTasks: number;
      completionRate: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Projects,${data.overview.totalProjects}\n`;
    csvContent += `Total Tasks,${data.overview.totalTasks}\n`;
    csvContent += `Completion Rate,${data.overview.completionRate}%\n`;
    csvContent += `Estimated Hours,${data.overview.totalEstimatedHours}\n`;
    csvContent += `Actual Hours,${data.overview.totalActualHours}\n\n`;

    csvContent += 'Project Key,Title,Total Tasks,Completed Tasks,Completion %\n';
    data.projectPerformance.forEach((p) => {
      csvContent += `${p.key},"${p.title}",${p.totalTasks},${p.completedTasks},${p.completionRate}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NOVA_analytics_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Productivity & Analytics Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time delivery velocity, burn-down metrics, and team workload insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Report (CSV)
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Aggregating analytics data...</p>
        </div>
      ) : data ? (
        <AnalyticsCharts data={data} />
      ) : (
        <p className="text-xs text-slate-400">No analytics data available.</p>
      )}
    </div>
  );
}
