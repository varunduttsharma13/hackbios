import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET() {
  try {
    const alerts = await DatabaseService.getAlerts();
    return NextResponse.json({ success: true, data: alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const alert = {
      id: `alert_${Date.now()}`,
      title: body.title,
      description: body.description,
      medicine_name: body.medicine_name,
      batch_number: body.batch_number || '',
      severity: body.severity || 'WARNING',
      source: body.source || 'Admin Direct Entry',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      active: true,
    };
    await DatabaseService.saveAlert(alert);
    return NextResponse.json({ success: true, data: alert });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
