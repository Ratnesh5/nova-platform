import { NextResponse } from 'next/server';
import { runDatabaseSeed } from '@/lib/seed-data';

export async function POST() {
  try {
    const result = await runDatabaseSeed();
    return NextResponse.json({
      success: true,
      message: 'Database reset and seeded with fresh sample data successfully!',
      stats: result,
    });
  } catch (error: unknown) {
    console.error('Seed API error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
