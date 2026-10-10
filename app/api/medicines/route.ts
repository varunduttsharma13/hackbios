import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET() {
  try {
    const medicines = await DatabaseService.getMedicines();
    return NextResponse.json({ success: true, data: medicines });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
