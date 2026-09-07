import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Subtask title is required' }, { status: 400 });
    }

    const maxOrder = await prisma.subtask.findFirst({
      where: { taskId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const subtask = await prisma.subtask.create({
      data: {
        taskId,
        title: title.trim(),
        completed: false,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ subtask, message: 'Subtask added' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Subtask POST error:', error);
    return NextResponse.json({ error: 'Failed to add subtask' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const { subtaskId, completed, title } = await req.json();

    if (!subtaskId) {
      return NextResponse.json({ error: 'Subtask ID is required' }, { status: 400 });
    }

    const updated = await prisma.subtask.update({
      where: { id: subtaskId, taskId },
      data: {
        completed: completed !== undefined ? completed : undefined,
        title: title !== undefined ? title.trim() : undefined,
      },
    });

    return NextResponse.json({ subtask: updated, message: 'Subtask updated' });
  } catch (error: unknown) {
    console.error('Subtask PUT error:', error);
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const { searchParams } = new URL(req.url);
    const subtaskId = searchParams.get('subtaskId');

    if (!subtaskId) {
      return NextResponse.json({ error: 'Subtask ID is required' }, { status: 400 });
    }

    await prisma.subtask.delete({
      where: { id: subtaskId, taskId },
    });

    return NextResponse.json({ message: 'Subtask removed' });
  } catch (error: unknown) {
    console.error('Subtask DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove subtask' }, { status: 500 });
  }
}
