import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true, role: true, title: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true, role: true, title: true, department: true },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, avatarUrl: true, title: true },
            },
            creator: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
            subtasks: {
              orderBy: { order: 'asc' },
            },
            comments: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
            _count: {
              select: { subtasks: true, comments: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        activities: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const total = project.tasks.length;
    const completed = project.tasks.filter((t) => t.status === 'DONE').length;
    const inProgress = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const inReview = project.tasks.filter((t) => t.status === 'IN_REVIEW').length;
    const todo = project.tasks.filter((t) => t.status === 'TODO').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      project: {
        ...project,
        taskMetrics: {
          total,
          completed,
          inProgress,
          inReview,
          todo,
          completionPercentage,
        },
      },
    });
  } catch (error: unknown) {
    console.error('Project GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch project details' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);
    const body = await req.json();

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        description: body.description !== undefined ? body.description : existing.description,
        status: body.status !== undefined ? body.status : existing.status,
        priority: body.priority !== undefined ? body.priority : existing.priority,
        category: body.category !== undefined ? body.category : existing.category,
        budget: body.budget !== undefined ? parseFloat(body.budget) : existing.budget,
        color: body.color !== undefined ? body.color : existing.color,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
      },
    });

    if (user) {
      await prisma.activityLog.create({
        data: {
          projectId: id,
          userId: user.id,
          action: 'PROJECT_UPDATED',
          details: `Updated project details for ${updated.title}`,
          entityType: 'PROJECT',
          entityId: id,
        },
      });
    }

    return NextResponse.json({ project: updated, message: 'Project updated successfully' });
  } catch (error: unknown) {
    console.error('Project PUT error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: unknown) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
