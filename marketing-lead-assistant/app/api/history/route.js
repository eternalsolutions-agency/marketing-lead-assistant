import { NextResponse } from 'next/server';
import { appendHistory } from '@/lib/sheets';

export async function POST(request) {
  try {
    const body = await request.json();
    await appendHistory(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
