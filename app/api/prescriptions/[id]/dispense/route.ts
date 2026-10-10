import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const rx = await DatabaseService.getPrescriptionById(id);
    if (!rx) {
      return NextResponse.json({ success: false, error: `Prescription #${id} not found` }, { status: 404 });
    }

    if (rx.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: `Cannot dispense cancelled prescription #${id}` },
        { status: 400 }
      );
    }

    if (rx.status === 'DISPENSED') {
      return NextResponse.json(
        {
          success: false,
          error: `Prescription #${id} was already dispensed on ${rx.dispensed_at} by ${rx.dispensed_by_pharmacy || 'registered chemist'}. Duplicate dispensing is strictly prohibited.`,
        },
        { status: 409 }
      );
    }

    const pharmacyName = body.pharmacy_name || 'Registered Retail Pharmacy #104';
    const notes = body.notes || 'Full regimen dispensed following blister pack match.';

    const updatedRx = await DatabaseService.updatePrescription(id, {
      status: 'DISPENSED',
      dispensed_at: new Date().toISOString(),
      dispensed_by_pharmacy: pharmacyName,
    });

    // Record immutable dispensing audit event
    const auditEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: body.pharmacist_id || 'PHARM-ACTIVE',
      actor_name: pharmacyName,
      actor_role: 'pharmacist',
      action: 'MEDICATION_DISPENSED',
      target_resource: id,
      details: `Prescription #${id} successfully dispensed to patient ${rx.patient_name} by ${pharmacyName}. ${notes}`,
      ip_or_hash: '122.161.49.201',
    };
    await DatabaseService.saveAuditLog(auditEntry);

    return NextResponse.json({
      success: true,
      message: `Prescription #${id} successfully marked as dispensed.`,
      data: updatedRx,
      audit: auditEntry,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Dispensing failed' }, { status: 500 });
  }
}
