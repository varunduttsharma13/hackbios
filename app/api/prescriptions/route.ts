import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';
import { Prescription } from '@/types/prescription';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    let prescriptions = await DatabaseService.getPrescriptions();

    if (patientId) {
      prescriptions = prescriptions.filter(
        (p) => p.patient_id === patientId || p.patient_name?.toLowerCase().includes(patientId.toLowerCase())
      );
    }
    if (doctorId) {
      prescriptions = prescriptions.filter((p) => p.doctor_id === doctorId);
    }
    if (status) {
      prescriptions = prescriptions.filter((p) => p.status === status);
    }
    if (query) {
      const q = query.toLowerCase();
      prescriptions = prescriptions.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.patient_name?.toLowerCase().includes(q) ||
          p.patient_phone?.includes(q) ||
          p.doctor_name.toLowerCase().includes(q) ||
          p.extracted_medicines.some((m) => m.medicine_name.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, data: prescriptions, count: prescriptions.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.extracted_medicines || !Array.isArray(body.extracted_medicines) || body.extracted_medicines.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one prescribed medicine is required.' },
        { status: 400 }
      );
    }

    const rxId = body.id || `DS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPrescription: Prescription = {
      id: rxId,
      version: (body.version || 0) + 1,
      doctor_name: body.doctor_name || 'Dr. J Dela Cruz, MD',
      doctor_id: body.doctor_id || 'DOC-4921',
      doctor_license: body.doctor_license || 'MCI-DEL-2018-4921',
      doctor_ptr: body.doctor_ptr || 'PTR-90214',
      hospital_name: body.hospital_name || 'Apollo Indraprastha Hospital, New Delhi',
      patient_id: body.patient_id || 'PAT-10452',
      patient_name: body.patient_name || 'Patient',
      patient_phone: body.patient_phone || '+91 98765 43210',
      patient_age: body.patient_age || 30,
      patient_gender: body.patient_gender || 'Not specified',
      patient_address: body.patient_address || '',
      abha_id: body.abha_id,
      prescription_date: body.prescription_date || new Date().toISOString().split('T')[0],
      extracted_medicines: body.extracted_medicines,
      status: body.status || 'DRAFT',
      created_at: body.created_at || new Date().toISOString(),
      allergy_notes: body.allergy_notes || 'None noted',
      diagnosis: body.diagnosis || 'Clinical Consultation',
      follow_up_date: body.follow_up_date || '2026-11-15',
    };

    const saved = await DatabaseService.savePrescription(newPrescription);

    // Record audit event for prescription creation
    await DatabaseService.saveAuditLog({
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: saved.doctor_id || 'DOC-CURRENT',
      actor_name: saved.doctor_name,
      actor_role: 'doctor',
      action: 'PRESCRIPTION_CREATED',
      target_resource: saved.id,
      details: `Prescription #${saved.id} created with ${saved.extracted_medicines.length} medicine(s) for ${saved.patient_name}.`,
      ip_or_hash: '127.0.0.1',
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create prescription' }, { status: 500 });
  }
}
