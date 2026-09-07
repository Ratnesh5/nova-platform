import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signJwt } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, title, department } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in or use a different email.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        title: title?.trim() || 'Team Member',
        department: department?.trim() || 'Engineering',
        role: 'MEMBER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        title: true,
        department: true,
        avatarUrl: true,
      },
    });

    const token = signJwt({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: 'Account created successfully',
      user,
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
    console.error('Registration error:', error);
    const errMsg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: `Failed to create user account: ${errMsg}` }, { status: 500 });
  }
}
