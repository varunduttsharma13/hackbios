import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';
import { CaregiverDelegation, CaregiverPermission } from '@/types/family';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patient_id') || 'PAT-10452';

    const delegations = await DatabaseService.getCaregiverDelegations(patientId);
    return NextResponse.json({
      success: true,
      patient_id: patientId,
      delegations,
      count: delegations.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_id, patient_name, caregiver_name, caregiver_phone, relationship, permissions, expires_at } = body;

    if (!patient_id || !caregiver_name || !relationship) {
      return NextResponse.json(
        { success: false, error: 'patient_id, caregiver_name, and relationship are required' },
        { status: 400 }
      );
    }

    const validPermissions: CaregiverPermission[] = [
      'VIEW_PRESCRIPTIONS',
      'MANAGE_REMINDERS',
      'VIEW_LAB_REPORTS',
      'RECEIVE_EMERGENCY_ALERTS',
    ];

    const grantedPermissions: CaregiverPermission[] = Array.isArray(permissions) && permissions.length > 0
      ? permissions.filter((p: any) => validPermissions.includes(p))
      : ['VIEW_PRESCRIPTIONS', 'MANAGE_REMINDERS'];

    const newDelegation: CaregiverDelegation = {
      id: `del-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      patient_id,
      patient_name: patient_name || 'Lolita Sharma',
      caregiver_name,
      caregiver_phone: caregiver_phone || '+91 90000 00000',
      relationship,
      permissions: grantedPermissions,
      status: 'ACTIVE',
      granted_at: new Date().toISOString(),
      expires_at: expires_at || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    };

    const saved = await DatabaseService.saveCaregiverDelegation(newDelegation);

    // Audit log
    await DatabaseService.saveAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_id: patient_id,
      actor_name: patient_name || 'Patient',
      actor_role: 'patient',
      action: 'CAREGIVER_ACCESS_GRANTED',
      target_resource: saved.id,
      details: `Granted access to ${caregiver_name} (${relationship}). Permissions: ${grantedPermissions.join(', ')}`,
    });

    return NextResponse.json({
      success: true,
      message: `Caregiver access granted to ${caregiver_name}`,
      delegation: saved,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const delegationId = searchParams.get('id');
    const reason = searchParams.get('reason') || 'Patient revoked authorization';

    if (!delegationId) {
      return NextResponse.json({ success: false, error: 'delegation id is required' }, { status: 400 });
    }

    const revoked = await DatabaseService.revokeCaregiverDelegation(delegationId, reason);
    if (!revoked) {
      return NextResponse.json({ success: false, error: 'Delegation record not found' }, { status: 404 });
    }

    // Audit log
    await DatabaseService.saveAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_id: revoked.patient_id,
      actor_name: revoked.patient_name,
      actor_role: 'patient',
      action: 'CAREGIVER_ACCESS_REVOKED',
      target_resource: delegationId,
      details: `Revoked access for caregiver ${revoked.caregiver_name}. Reason: ${reason}`,
    });

    return NextResponse.json({
      success: true,
      message: `Caregiver access for ${revoked.caregiver_name} revoked`,
      delegation: revoked,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
