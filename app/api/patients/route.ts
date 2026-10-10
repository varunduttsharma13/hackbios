import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function GET() {
  try {
    const patients = await DatabaseService.getPatients();
    return NextResponse.json({ success: true, data: patients, count: patients.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: 'Patient name and phone are required' }, { status: 400 });
    }

    const patient = {
      id: body.id || `PAT-${Math.floor(10000 + Math.random() * 90000)}`,
      name: body.name,
      age: body.age || 30,
      gender: body.gender || 'Female',
      phone: body.phone,
      address: body.address || '',
      abha_id: body.abha_id || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      known_allergies: Array.isArray(body.known_allergies) ? body.known_allergies : [],
      chronic_conditions: Array.isArray(body.chronic_conditions) ? body.chronic_conditions : [],
    };

    const saved = await DatabaseService.savePatient(patient);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to register patient' }, { status: 500 });
  }
}
