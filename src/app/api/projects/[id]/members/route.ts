import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const user = await getSessionUser(req);
    const { userId, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const member = await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      update: {
        role: role || 'CONTRIBUTOR',
      },
      create: {
        projectId,
        userId,
        role: role || 'CONTRIBUTOR',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true, role: true, title: true, department: true },
        },
      },
    });

    if (user) {
      await prisma.activityLog.create({
        data: {
          projectId,
          userId: user.id,
          action: 'MEMBER_ADDED',
          details: `Added ${member.user.name} to the project`,
          entityType: 'MEMBER',
          entityId: userId,
        },
      });
    }

    return NextResponse.json({ member, message: 'Member updated successfully' });
  } catch (error: unknown) {
    console.error('Project member POST error:', error);
    return NextResponse.json({ error: 'Failed to add project member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await prisma.projectMember.deleteMany({
      where: {
        projectId,
        userId,
      },
    });

    return NextResponse.json({ message: 'Member removed from project' });
  } catch (error: unknown) {
    console.error('Project member DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
