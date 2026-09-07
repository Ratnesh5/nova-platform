import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ comments });
  } catch (error: unknown) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const user = await getSessionUser(req);
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment text cannot be empty' }, { status: 400 });
    }

    let userId = user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ error: 'User required to post comment' }, { status: 400 });
      }
      userId = defaultUser.id;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, projectId: true, title: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        userId,
        content: content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, title: true } },
      },
    });

    await prisma.activityLog.create({
      data: {
        projectId: task.projectId,
        userId,
        action: 'COMMENT_ADDED',
        details: `Commented on task "${task.title}"`,
        entityType: 'COMMENT',
        entityId: comment.id,
      },
    });

    return NextResponse.json({ comment, message: 'Comment posted' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Comment POST error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
