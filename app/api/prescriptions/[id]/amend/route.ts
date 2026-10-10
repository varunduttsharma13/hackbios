import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';
import { Prescription } from '@/types/prescription';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const original = await DatabaseService.getPrescriptionById(id);

    if (!original) {
      return NextResponse.json(
        { success: false, error: `Original prescription ${id} not found` },
        { status: 404 }
      );
    }

    if (original.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'Cannot amend a cancelled prescription' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      amended_medicines,
      amendment_reason,
      doctor_name,
      doctor_license,
      notes,
    } = body;

    if (!amended_medicines || !Array.isArray(amended_medicines) || amended_medicines.length === 0) {
      return NextResponse.json(
        { success: false, error: 'amended_medicines array is required' },
        { status: 400 }
      );
    }

    const currentVersion = original.version || 1;
    const newVersion = currentVersion + 1;
    const newId = `${original.id.split('-v')[0]}-v${newVersion}`;

    // 1. Mark original as SUPERSEDED to preserve historical immutability
    await DatabaseService.updatePrescription(original.id, {
      status: 'SUPERSEDED',
    });

    // 2. Create the new versioned prescription
    const amendedPrescription: Prescription = {
      ...original,
      id: newId,
      version: newVersion,
      extracted_medicines: amended_medicines,
      prescription_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
      status: 'APPROVED',
      doctor_name: doctor_name || original.doctor_name,
      doctor_license: doctor_license || original.doctor_license,
      allergy_notes: notes || original.allergy_notes,
    };

    const saved = await DatabaseService.savePrescription(amendedPrescription);

    // 3. Record immutable audit log
    await DatabaseService.saveAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_id: doctor_license || 'DOC-DEFAULT',
      actor_name: doctor_name || original.doctor_name,
      actor_role: 'doctor',
      action: 'PRESCRIPTION_AMENDED_VERSIONED',
      target_resource: original.id,
      details: `Prescription ${original.id} amended to Version ${newVersion} (${newId}). Reason: ${amendment_reason || 'Clinical adjustment'}. Original marked as SUPERSEDED.`,
    });

    return NextResponse.json({
      success: true,
      message: `Prescription version ${newVersion} created successfully`,
      superseded_prescription_id: original.id,
      new_prescription: saved,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
