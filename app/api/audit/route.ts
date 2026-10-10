import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET() {
  try {
    const logs = await DatabaseService.getAuditLogs();
    return NextResponse.json({ success: true, data: logs, count: logs.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = {
      id: body.id || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: body.timestamp || new Date().toISOString(),
      actor_id: body.actor_id || 'UNKNOWN_ACTOR',
      actor_name: body.actor_name || 'System User',
      actor_role: body.actor_role || 'doctor',
      action: body.action || 'GENERAL_ACTION',
      target_resource: body.target_resource || '',
      details: body.details || '',
      ip_or_hash: body.ip_or_hash || `SHA256:${Math.random().toString(36).substring(2, 10)}`,
    };

    const saved = await DatabaseService.saveAuditLog(entry);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to record audit event' }, { status: 500 });
  }
}
