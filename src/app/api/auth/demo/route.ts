import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJwt } from '@/lib/auth';
import { runDatabaseSeed } from '@/lib/seed-data';

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json().catch(() => ({ role: 'ADMIN' }));

    // Check if database has users, if not, auto-seed!
    let count = await prisma.user.count();
    if (count === 0) {
      await runDatabaseSeed();
    }

    let email = 'alex@nova.io';
    if (role === 'FRONTEND' || role === 'sarah') email = 'sarah@nova.io';
    if (role === 'DESIGNER' || role === 'elena') email = 'elena@nova.io';
    if (role === 'BACKEND' || role === 'marcus') email = 'marcus@nova.io';

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return NextResponse.json({ error: 'No demo users found' }, { status: 404 });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      department: user.department,
      avatarUrl: user.avatarUrl,
    };

    const token = signJwt({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: 'Demo login successful',
      user: safeUser,
      token,
    });

    response.cookies.set('nova_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Demo login failed' }, { status: 500 });
  }
}
