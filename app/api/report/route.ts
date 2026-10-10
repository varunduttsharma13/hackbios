import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verificationRecord, safetyReport } = body;

    const reportPayload = {
      title: 'MED-BRIDGE - MEDICINE SAFETY VERIFICATION REPORT',
      verification_id: verificationRecord?.id || `v_${Date.now()}`,
      generated_at: new Date().toISOString(),
      prescribed_medicine: verificationRecord?.prescribed_medicine_name || 'N/A',
      prescribed_strength: verificationRecord?.prescribed_strength || 'N/A',
      scanned_medicine: verificationRecord?.scanned_medicine_name || 'N/A',
      scanned_batch: verificationRecord?.scanned_batch || 'N/A',
      scanned_manufacturer: verificationRecord?.scanned_manufacturer || 'N/A',
      scanned_expiry: verificationRecord?.scanned_expiry || 'N/A',
      match_status: verificationRecord?.match_status || 'UNKNOWN',
      overall_status: safetyReport?.overall_status || 'ATTENTION_REQUIRED',
      disclaimer: 'This report is an automated verification aid and does not replace professional medical advice. Always consult a qualified pharmacist or clinician before consuming medications.',
    };

    return NextResponse.json({ success: true, report: reportPayload });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
