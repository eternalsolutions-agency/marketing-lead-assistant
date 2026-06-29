import { NextResponse } from 'next/server';
import { addLead, listLeads } from '@/lib/sheets';

export async function GET() {
  try {
    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const lead = await addLead(body);
    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
