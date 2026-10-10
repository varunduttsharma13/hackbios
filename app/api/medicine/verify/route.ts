import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    const medicine = await DatabaseService.findMedicineByCode(code || 'DS-MET-500-A');
    if (!medicine) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        medicine: medicine.medicine_name,
        batch: medicine.batch_number,
        manufacturer: medicine.manufacturer,
        manufacture_date: medicine.manufacture_date,
        expiry_date: medicine.expiry_date,
        verification_status: medicine.verification_status,
        disclaimer: 'Verified against trusted/demo registry for demonstration purposes.',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
