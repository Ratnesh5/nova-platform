import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (category && category !== 'ALL') where.category = category;
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { key: { contains: search } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true, role: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true, title: true, role: true },
            },
          },
        },
        tasks: {
          select: { id: true, status: true, priority: true, estimatedHours: true, actualHours: true },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Compute progress metrics for each project
    const enrichedProjects = projects.map((p) => {
      const total = p.tasks.length;
      const completed = p.tasks.filter((t) => t.status === 'DONE').length;
      const inProgress = p.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const inReview = p.tasks.filter((t) => t.status === 'IN_REVIEW').length;
      const todo = p.tasks.filter((t) => t.status === 'TODO').length;
      const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...p,
        taskMetrics: {
          total,
          completed,
          inProgress,
          inReview,
          todo,
          completionPercentage,
        },
      };
    });

    return NextResponse.json({ projects: enrichedProjects });
  } catch (error: unknown) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const body = await req.json();
    const { title, key, description, category, priority, budget, startDate, dueDate, color } = body;

    if (!title || !key) {
      return NextResponse.json({ error: 'Project Title and Key are required' }, { status: 400 });
    }

    // Default to first user if no active session in dev
    let ownerId = user?.id;
    if (!ownerId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ error: 'No users found to assign project ownership' }, { status: 400 });
      }
      ownerId = defaultUser.id;
    }

    const existingKey = await prisma.project.findUnique({
      where: { key: key.toUpperCase().trim() },
    });

    if (existingKey) {
      return NextResponse.json({ error: `Project key "${key}" is already in use` }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        key: key.toUpperCase().trim(),
        description: description?.trim() || null,
        category: category || 'Engineering',
        priority: priority || 'MEDIUM',
        status: 'IN_PROGRESS',
        budget: budget ? parseFloat(budget) : 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        color: color || '#6366f1',
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: { include: { user: true } },
        _count: { select: { tasks: true, members: true } },
      },
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: ownerId,
        action: 'PROJECT_CREATED',
        details: `Created project ${project.title} (${project.key})`,
        entityType: 'PROJECT',
        entityId: project.id,
      },
    });

    return NextResponse.json({ project, message: 'Project created successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
