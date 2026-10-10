import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const medicines = await DatabaseService.getMedicines();
    const found = medicines.find((m) => m.id === id || m.medicine_name.toLowerCase().includes(id.toLowerCase()));

    if (!found) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: found });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
