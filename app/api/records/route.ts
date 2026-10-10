import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';
import { HealthRecord } from '@/types/healthRecords';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    let records = await DatabaseService.getHealthRecords(patientId || undefined);

    if (category && category !== 'ALL') {
      records = records.filter((r) => r.category === category);
    }

    if (query) {
      const q = query.toLowerCase();
      records = records.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.doctor_or_institution?.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, data: records, count: records.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support bulk import array
    if (Array.isArray(body)) {
      const createdList: HealthRecord[] = [];
      for (const item of body) {
        const recId = item.id || `HR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const rec: HealthRecord = {
          id: recId,
          patient_id: item.patient_id || 'PAT-10452',
          patient_name: item.patient_name || 'Lolita Alvarez',
          title: item.title || 'Medical Record',
          category: item.category || 'OTHER',
          record_date: item.record_date || new Date().toISOString().split('T')[0],
          doctor_or_institution: item.doctor_or_institution || 'Clinical Laboratory',
          description: item.description || '',
          tags: Array.isArray(item.tags) ? item.tags : [],
          file_name: item.file_name,
          file_size: item.file_size,
          file_type: item.file_type,
          source: item.source || 'TRUSTED_IMPORT',
          verification_status: item.verification_status || 'PENDING_REVIEW',
          notes: item.notes,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        };
        const saved = await DatabaseService.saveHealthRecord(rec);
        createdList.push(saved);
      }
      return NextResponse.json({ success: true, count: createdList.length, data: createdList }, { status: 201 });
    }

    // Single record creation
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Record title is required' }, { status: 400 });
    }

    const recId = body.id || `HR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: HealthRecord = {
      id: recId,
      patient_id: body.patient_id || 'PAT-10452',
      patient_name: body.patient_name || 'Lolita Alvarez',
      title: body.title,
      category: body.category || 'OTHER',
      record_date: body.record_date || new Date().toISOString().split('T')[0],
      doctor_or_institution: body.doctor_or_institution || 'Healthcare Provider',
      description: body.description || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      file_name: body.file_name,
      file_size: body.file_size,
      file_type: body.file_type,
      file_url: body.file_url || body.file_data,
      source: body.source || 'USER_UPLOAD',
      verification_status: body.verification_status || 'PENDING_REVIEW',
      notes: body.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = await DatabaseService.saveHealthRecord(newRecord);

    await DatabaseService.saveAuditLog({
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: body.patient_id || 'USER-CURRENT',
      actor_name: body.patient_name || 'Patient',
      actor_role: 'patient',
      action: 'HEALTH_RECORD_ADDED',
      target_resource: saved.id,
      details: `Health record "${saved.title}" (${saved.category}) uploaded and archived.`,
      ip_or_hash: '127.0.0.1',
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to save health record' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Record ID is required for updates' }, { status: 400 });
    }

    const updated = await DatabaseService.updateHealthRecord(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: `Record #${id} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Record ID is required' }, { status: 400 });
    }

    const success = await DatabaseService.deleteHealthRecord(id);
    if (!success) {
      return NextResponse.json({ success: false, error: `Record #${id} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Record #${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Deletion failed' }, { status: 500 });
  }
}
