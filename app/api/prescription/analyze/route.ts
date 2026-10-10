import { NextRequest, NextResponse } from 'next/server';
import { analyzePrescriptionImage } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, preset } = body;

    const result = await analyzePrescriptionImage(imageBase64 || '', preset || 'metformin_atorvastatin');

    return NextResponse.json({
      success: true,
      data: result,
      ai_model: process.env.GEMINI_API_KEY ? 'Gemini 1.5 Flash Vision' : 'MED-BRIDGE Vision AI Engine (Demo Mode)',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze prescription' },
      { status: 500 }
    );
  }
}
