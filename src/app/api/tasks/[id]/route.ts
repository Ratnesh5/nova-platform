import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true, key: true, color: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true, title: true } },
        creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        subtasks: { orderBy: { order: 'asc' } },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error: unknown) {
    console.error('Task GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);
    const body = await req.json();

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const isStatusChanging = body.status && body.status !== existing.status;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title.trim() : existing.title,
        description: body.description !== undefined ? body.description : existing.description,
        status: body.status !== undefined ? body.status : existing.status,
        priority: body.priority !== undefined ? body.priority : existing.priority,
        order: body.order !== undefined ? parseInt(body.order) : existing.order,
        dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : existing.dueDate,
        assigneeId: body.assigneeId !== undefined ? body.assigneeId : existing.assigneeId,
        estimatedHours: body.estimatedHours !== undefined ? parseFloat(body.estimatedHours) : existing.estimatedHours,
        actualHours: body.actualHours !== undefined ? parseFloat(body.actualHours) : existing.actualHours,
      },
      include: {
        project: { select: { id: true, title: true, key: true, color: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true, title: true } },
        creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        subtasks: { orderBy: { order: 'asc' } },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (user && isStatusChanging) {
      await prisma.activityLog.create({
        data: {
          projectId: updated.projectId,
          userId: user.id,
          action: 'TASK_MOVED',
          details: `Moved task "${updated.title}" to ${updated.status}`,
          entityType: 'TASK',
          entityId: updated.id,
        },
      });
    }

    return NextResponse.json({ task: updated, message: 'Task updated successfully' });
  } catch (error: unknown) {
    console.error('Task PUT error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser(req);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    if (user) {
      await prisma.activityLog.create({
        data: {
          projectId: task.projectId,
          userId: user.id,
          action: 'TASK_DELETED',
          details: `Deleted task "${task.title}"`,
          entityType: 'TASK',
          entityId: id,
        },
      });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    console.error('Task DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
