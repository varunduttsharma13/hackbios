import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db/supabase';
import { MedicationReminder, ReminderTimeSlot, AdherenceStatus, AdherenceMetric } from '@/types/reminders';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patient_id') || 'PAT-10452';

    const prescriptions = await DatabaseService.getPrescriptions();
    const activePrescriptions = prescriptions.filter(
      (p) =>
        (p.patient_id === patientId || !patientId) &&
        p.status !== 'CANCELLED' &&
        p.status !== 'SUPERSEDED'
    );

    const adherenceLogs = await DatabaseService.getAdherenceLogs(patientId);
    const reminders: MedicationReminder[] = [];

    for (const rx of activePrescriptions) {
      for (const med of rx.extracted_medicines || []) {
        const freq = (med.frequency || '').toLowerCase();
        const slots: { slot: ReminderTimeSlot; time: string; defaultInstruction: string }[] = [];

        if (freq.includes('twice') || freq.includes('bid') || freq.includes('bd') || freq.includes('2')) {
          slots.push({ slot: 'MORNING', time: '08:00 AM', defaultInstruction: 'Take after morning breakfast' });
          slots.push({ slot: 'NIGHT', time: '08:30 PM', defaultInstruction: 'Take after dinner' });
        } else if (freq.includes('thrice') || freq.includes('tid') || freq.includes('tds') || freq.includes('3')) {
          slots.push({ slot: 'MORNING', time: '08:00 AM', defaultInstruction: 'Take after morning breakfast' });
          slots.push({ slot: 'AFTERNOON', time: '01:30 PM', defaultInstruction: 'Take after lunch' });
          slots.push({ slot: 'NIGHT', time: '08:30 PM', defaultInstruction: 'Take after dinner' });
        } else if (freq.includes('night') || freq.includes('bedtime') || freq.includes('hs')) {
          slots.push({ slot: 'NIGHT', time: '09:30 PM', defaultInstruction: 'Take before bedtime with water' });
        } else {
          // Default once daily morning
          slots.push({ slot: 'MORNING', time: '08:00 AM', defaultInstruction: 'Take in the morning with meal' });
        }

        for (const s of slots) {
          const reminderId = `rem-${rx.id}-${med.id || med.medicine_name.replace(/\s+/g, '-').toLowerCase()}-${s.slot.toLowerCase()}`;
          const existingLog = adherenceLogs.find((l) => l.reminder_id === reminderId);

          reminders.push({
            id: reminderId,
            patient_id: rx.patient_id || patientId,
            patient_name: rx.patient_name || 'Lolita Sharma',
            prescription_id: rx.id,
            medicine_name: med.medicine_name,
            strength: med.strength,
            dosage_form: med.dosage_form || 'Tablet',
            slot: s.slot,
            time_label: s.time,
            instructions: med.instructions || s.defaultInstruction,
            status: existingLog ? existingLog.status : 'SCHEDULED',
            logged_at: existingLog?.logged_at,
            notes: existingLog?.notes,
          });
        }
      }
    }

    // Calculate Adherence Metrics
    const totalScheduled = reminders.length;
    const takenCount = reminders.filter((r) => r.status === 'TAKEN').length;
    const skippedCount = reminders.filter((r) => r.status === 'SKIPPED').length;
    const snoozedCount = reminders.filter((r) => r.status === 'SNOOZED').length;
    const adherenceRate = totalScheduled > 0 ? Math.round((takenCount / totalScheduled) * 100) : 100;

    const metrics: AdherenceMetric = {
      total_scheduled: totalScheduled,
      taken_count: takenCount,
      skipped_count: skippedCount,
      snoozed_count: snoozedCount,
      adherence_rate: adherenceRate,
      streak_days: 14, // demo streak counter
    };

    return NextResponse.json({
      success: true,
      reminders,
      metrics,
      total_active_prescriptions: activePrescriptions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reminder_id, status, notes, patient_id, medicine_name } = body;

    if (!reminder_id || !status) {
      return NextResponse.json(
        { success: false, error: 'reminder_id and status (TAKEN | SKIPPED | SNOOZED) are required' },
        { status: 400 }
      );
    }

    const validStatuses: AdherenceStatus[] = ['SCHEDULED', 'TAKEN', 'SKIPPED', 'SNOOZED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const log = await DatabaseService.saveAdherenceLog({
      reminder_id,
      patient_id: patient_id || 'PAT-10452',
      medicine_name: medicine_name || 'Prescribed Medicine',
      status,
      notes,
    });

    // Record immutable audit log
    await DatabaseService.saveAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_id: patient_id || 'PAT-10452',
      actor_name: 'Patient Intake Portal',
      actor_role: 'patient',
      action: 'MEDICATION_ADHERENCE_LOGGED',
      target_resource: reminder_id,
      details: `Status set to ${status}. Medicine: ${medicine_name || 'N/A'}. Notes: ${notes || 'None'}`,
    });

    return NextResponse.json({
      success: true,
      message: `Adherence event '${status}' recorded successfully`,
      log,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
