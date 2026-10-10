import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescription = await DatabaseService.getPrescriptionById(id);

    if (!prescription) {
      return NextResponse.json({ success: false, error: `Prescription #${id} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: prescription });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Lookup failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await DatabaseService.getPrescriptionById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: `Prescription #${id} not found` }, { status: 404 });
    }

    const updated = await DatabaseService.updatePrescription(id, body);

    await DatabaseService.saveAuditLog({
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: body.actor_id || 'SYSTEM',
      actor_name: body.actor_name || 'System User',
      actor_role: body.actor_role || 'doctor',
      action: 'PRESCRIPTION_UPDATED',
      target_resource: id,
      details: `Prescription #${id} updated with fields: ${Object.keys(body).join(', ')}.`,
      ip_or_hash: '127.0.0.1',
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await DatabaseService.getPrescriptionById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: `Prescription #${id} not found` }, { status: 404 });
    }

    // Mark as CANCELLED rather than hard delete for medical audit trail
    const cancelled = await DatabaseService.updatePrescription(id, { status: 'CANCELLED' });

    await DatabaseService.saveAuditLog({
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: 'SYSTEM',
      actor_name: 'Authorized Clinician',
      actor_role: 'doctor',
      action: 'PRESCRIPTION_CANCELLED',
      target_resource: id,
      details: `Prescription #${id} marked as CANCELLED.`,
      ip_or_hash: '127.0.0.1',
    });

    return NextResponse.json({ success: true, message: `Prescription #${id} cancelled successfully`, data: cancelled });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Cancellation failed' }, { status: 500 });
  }
}
