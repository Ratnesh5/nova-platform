import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (assigneeId) where.assigneeId = assigneeId;
    if (status && status !== 'ALL') where.status = status;
    if (priority && priority !== 'ALL') where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: { id: true, title: true, key: true, color: true },
        },
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
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    console.error('Tasks GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const body = await req.json();
    const { projectId, title, description, status, priority, dueDate, assigneeId, estimatedHours, subtasks } = body;

    if (!projectId || !title) {
      return NextResponse.json({ error: 'Project ID and task title are required' }, { status: 400 });
    }

    let createdById = user?.id;
    if (!createdById) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ error: 'No user available to create task' }, { status: 400 });
      }
      createdById = defaultUser.id;
    }

    // Get max order in the column
    const maxOrderTask = await prisma.task.findFirst({
      where: { projectId, status: status || 'TODO' },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = (maxOrderTask?.order ?? -1) + 1;

    const task = await prisma.task.create({
      data: {
        projectId,
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        order,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0,
        createdById,
        assigneeId: assigneeId || null,
        subtasks: Array.isArray(subtasks) && subtasks.length > 0
          ? {
              create: subtasks.map((st: { title: string; completed?: boolean }, idx: number) => ({
                title: st.title,
                completed: !!st.completed,
                order: idx,
              })),
            }
          : undefined,
      },
      include: {
        project: { select: { id: true, title: true, key: true, color: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true, title: true } },
        creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        subtasks: true,
        comments: true,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        projectId,
        userId: createdById,
        action: 'TASK_CREATED',
        details: `Created task "${task.title}" in ${task.status}`,
        entityType: 'TASK',
        entityId: task.id,
      },
    });

    return NextResponse.json({ task, message: 'Task created successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Tasks POST error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
