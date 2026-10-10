import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET() {
  try {
    const history = await DatabaseService.getVerifications();
    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
