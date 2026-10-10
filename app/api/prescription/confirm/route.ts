import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicines } = body;

    const confirmedMedicines = medicines.map((m: any) => ({
      ...m,
      user_confirmed: true,
      confirmed_at: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: 'Prescription details confirmed by user.',
      data: confirmedMedicines,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
