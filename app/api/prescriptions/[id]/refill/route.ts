import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requests = await DatabaseService.getRefillRequests(id);
    return NextResponse.json({
      success: true,
      prescription_id: id,
      refill_requests: requests,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescription = await DatabaseService.getPrescriptionById(id);

    if (!prescription) {
      return NextResponse.json(
        { success: false, error: `Prescription ${id} not found` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action, refill_id, status, notes, doctor_name, requested_days, reason } = body;

    // A. Review an existing refill request (Doctor Action)
    if (action === 'REVIEW') {
      if (!refill_id || !status) {
        return NextResponse.json(
          { success: false, error: 'refill_id and status (APPROVED | REJECTED) are required for review' },
          { status: 400 }
        );
      }

      const updated = await DatabaseService.reviewRefillRequest(
        refill_id,
        status,
        doctor_name || prescription.doctor_name,
        notes
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, error: `Refill request ${refill_id} not found` },
          { status: 404 }
        );
      }

      await DatabaseService.saveAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor_id: doctor_name || prescription.doctor_name,
        actor_name: doctor_name || prescription.doctor_name,
        actor_role: 'doctor',
        action: `REFILL_REQUEST_${status}`,
        target_resource: refill_id,
        details: `Refill request for ${prescription.id} was ${status}. Notes: ${notes || 'None'}`,
      });

      return NextResponse.json({
        success: true,
        message: `Refill request ${status.toLowerCase()} successfully`,
        refill_request: updated,
      });
    }

    // B. Submit a new refill request (Patient or Pharmacist Action)
    const medNames = (prescription.extracted_medicines || []).map((m) => `${m.medicine_name} ${m.strength}`);
    const newRefill = await DatabaseService.saveRefillRequest({
      prescription_id: prescription.id,
      patient_id: prescription.patient_id || 'PAT-10452',
      patient_name: prescription.patient_name || 'Lolita Sharma',
      medicines: medNames,
      requested_days: Number(requested_days) || 30,
      reason: reason || 'Routine chronic maintenance medication continuation',
    });

    await DatabaseService.saveAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_id: prescription.patient_id || 'PAT-10452',
      actor_name: prescription.patient_name || 'Patient',
      actor_role: 'patient',
      action: 'REFILL_REQUEST_SUBMITTED',
      target_resource: prescription.id,
      details: `Refill requested for ${newRefill.requested_days} days. Reason: ${newRefill.reason}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Refill request submitted for doctor clinical review',
      refill_request: newRefill,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
