import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ user: null, authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ user, authenticated: true });
  } catch (error: unknown) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}

export async function POST() {
  // Logout endpoint - clear cookie
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('nova_token');
  return response;
}
