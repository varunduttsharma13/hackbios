import { NextRequest, NextResponse } from 'next/server';
import { runVerificationEngine } from '@/lib/safety/engine';
import { DEMO_ALERTS, DEMO_INTERACTIONS, DEMO_VERIFICATION_HISTORY } from '@/lib/mock/demoData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prescribed, stripItem } = body;

    if (!prescribed || !stripItem) {
      return NextResponse.json({ success: false, error: 'Both prescribed medicine and strip item are required' }, { status: 400 });
    }

    const { record, report } = runVerificationEngine(
      prescribed,
      stripItem,
      DEMO_ALERTS,
      DEMO_INTERACTIONS,
      DEMO_VERIFICATION_HISTORY
    );

    return NextResponse.json({
      success: true,
      data: {
        record,
        report,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
