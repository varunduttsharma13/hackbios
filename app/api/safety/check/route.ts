import { NextRequest, NextResponse } from 'next/server';
import { checkExpiry, checkRecall, checkInteractions } from '@/lib/safety/engine';
import { DEMO_ALERTS, DEMO_INTERACTIONS } from '@/lib/mock/demoData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicineName, strength, batchNumber, expiryDate } = body;

    const expiryStatus = expiryDate ? checkExpiry(expiryDate) : 'VALID';
    const recallCheck = checkRecall(medicineName || '', batchNumber || '', DEMO_ALERTS);
    const interactionCheck = checkInteractions(medicineName || '', DEMO_INTERACTIONS);

    return NextResponse.json({
      success: true,
      data: {
        expiryStatus,
        recallStatus: recallCheck.hasAlert ? 'ACTIVE_ALERT' : 'NO_ALERTS',
        recallDetails: recallCheck.alertDetails,
        interactionStatus: interactionCheck.hasInteraction ? 'POTENTIAL_INTERACTION' : 'SAFE',
        interactionDetails: interactionCheck.details,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
