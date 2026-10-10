import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';
import { analyzeMedicineStripImage } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, scanType, imageBase64, fileName, hintText } = body;

    // Handle Image / Media Upload and OCR Text Analysis
    if (imageBase64 || scanType === 'MEDIA_UPLOAD' || scanType === 'PHOTO') {
      const item = await analyzeMedicineStripImage(
        imageBase64 || '',
        fileName || hintText || code || ''
      );

      return NextResponse.json({
        success: true,
        data: item,
        scan_info: {
          raw_code: item.qr_code || code || 'MEDIA_OCR',
          scan_type: 'MEDIA_UPLOAD',
          detected_text: item.detected_raw_text,
          confidence: item.confidence_score,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!code) {
      return NextResponse.json({ success: false, error: 'Barcode/QR code or image is required' }, { status: 400 });
    }

    const item = await DatabaseService.findMedicineByCode(code);

    if (!item) {
      return NextResponse.json({
        success: false,
        error: 'Product code not found in trusted/demo medicine registry.',
        raw_code: code,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: item,
      scan_info: {
        raw_code: code,
        scan_type: scanType || 'QR',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
