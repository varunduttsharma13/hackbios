import { NextResponse } from 'next/server';
import { DEMO_USER } from '@/lib/mock/demoData';

export async function GET() {
  return NextResponse.json({ success: true, data: DEMO_USER });
}
