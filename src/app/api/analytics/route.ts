import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalProjects, totalTasks, totalUsers, projects, tasks, recentActivities] = await Promise.all([
      prisma.project.count(),
      prisma.task.count(),
      prisma.user.count(),
      prisma.project.findMany({
        include: {
          tasks: { select: { status: true, priority: true, estimatedHours: true, actualHours: true } },
          members: true,
        },
      }),
      prisma.task.findMany({
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true, department: true } },
          project: { select: { id: true, title: true, key: true, color: true } },
        },
      }),
      prisma.activityLog.findMany({
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          project: { select: { id: true, title: true, key: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
    ]);

    // Status breakdown
    const statusCounts = {
      TODO: tasks.filter((t) => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      IN_REVIEW: tasks.filter((t) => t.status === 'IN_REVIEW').length,
      DONE: tasks.filter((t) => t.status === 'DONE').length,
    };

    // Priority breakdown
    const priorityCounts = {
      URGENT: tasks.filter((t) => t.priority === 'URGENT').length,
      HIGH: tasks.filter((t) => t.priority === 'HIGH').length,
      MEDIUM: tasks.filter((t) => t.priority === 'MEDIUM').length,
      LOW: tasks.filter((t) => t.priority === 'LOW').length,
    };

    // Overall Completion %
    const completionRate = totalTasks > 0 ? Math.round((statusCounts.DONE / totalTasks) * 100) : 0;

    // Total Hours
    const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    // Team Workload Map
    const userWorkloadMap: Record<string, { name: string; avatarUrl?: string | null; totalTasks: number; doneTasks: number; inProgressTasks: number }> = {};
    
    tasks.forEach((t) => {
      if (t.assignee) {
        if (!userWorkloadMap[t.assignee.id]) {
          userWorkloadMap[t.assignee.id] = {
            name: t.assignee.name,
            avatarUrl: t.assignee.avatarUrl,
            totalTasks: 0,
            doneTasks: 0,
            inProgressTasks: 0,
          };
        }
        userWorkloadMap[t.assignee.id].totalTasks += 1;
        if (t.status === 'DONE') userWorkloadMap[t.assignee.id].doneTasks += 1;
        if (t.status === 'IN_PROGRESS') userWorkloadMap[t.assignee.id].inProgressTasks += 1;
      }
    });

    const workloadData = Object.values(userWorkloadMap);

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    projects.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });

    const projectPerformance = projects.map((p) => {
      const pTotal = p.tasks.length;
      const pDone = p.tasks.filter((t) => t.status === 'DONE').length;
      return {
        id: p.id,
        title: p.title,
        key: p.key,
        color: p.color,
        category: p.category,
        totalTasks: pTotal,
        completedTasks: pDone,
        completionRate: pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0,
      };
    });

    return NextResponse.json({
      overview: {
        totalProjects,
        totalTasks,
        totalUsers,
        completionRate,
        totalEstimatedHours,
        totalActualHours,
      },
      statusCounts,
      priorityCounts,
      workloadData,
      categoryDistribution: Object.entries(categoryMap).map(([name, count]) => ({ name, count })),
      projectPerformance,
      recentActivities,
    });
  } catch (error: unknown) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
