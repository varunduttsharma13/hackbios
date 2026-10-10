/**
 * MED-BRIDGE Backend Integration Test Suite
 * Tests all API endpoints: medicines, prescriptions, records, audit, alerts, dispensing, and safety.
 */

async function runBackendApiTests() {
  console.log('🧪 RUNNING MED-BRIDGE BACKEND INTEGRATION TEST SUITE...\n');
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => Promise<boolean>) {
    total++;
    try {
      const ok = await fn();
      if (ok) {
        console.log(`  ✅ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`  ❌ [FAIL] ${name}`);
      }
    } catch (e: any) {
      console.error(`  ❌ [ERROR] ${name}:`, e.message);
    }
  }

  // 1. GET /api/medicines
  await test('GET /api/medicines returns active medicine catalog', async () => {
    const res = await fetch(`${baseUrl}/api/medicines`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 5;
  });

  // 2. GET /api/alerts
  await test('GET /api/alerts returns CDSCO safety advisories', async () => {
    const res = await fetch(`${baseUrl}/api/alerts`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data);
  });

  // 3. GET /api/patients
  await test('GET /api/patients returns patient directory', async () => {
    const res = await fetch(`${baseUrl}/api/patients`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 3;
  });

  // 4. GET /api/prescriptions
  await test('GET /api/prescriptions returns active digital prescriptions', async () => {
    const res = await fetch(`${baseUrl}/api/prescriptions`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data);
  });

  // 5. GET /api/prescriptions/DS-10452
  await test('GET /api/prescriptions/DS-10452 retrieves specific prescription', async () => {
    const res = await fetch(`${baseUrl}/api/prescriptions/DS-10452`);
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.id === 'DS-10452' && data.data.patient_name === 'Lolita Alvarez';
  });

  // 6. POST /api/prescriptions (Create new digital prescription)
  let createdRxId = '';
  await test('POST /api/prescriptions creates structured e-prescription', async () => {
    const res = await fetch(`${baseUrl}/api/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_name: 'Dr. Test Clinician',
        patient_name: 'Aarav Sharma',
        patient_phone: '+91 99999 88888',
        extracted_medicines: [
          {
            medicine_name: 'Amoxicillin Trihydrate',
            strength: '500 mg',
            dosage_form: 'Capsule',
            frequency: 'TDS (8 hourly)',
            duration: '7 days',
          },
        ],
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success === true && data.data.id) {
      createdRxId = data.data.id;
      return true;
    }
    return false;
  });

  // 7. PATCH /api/prescriptions/[id]
  await test('PATCH /api/prescriptions/[id] updates prescription status', async () => {
    if (!createdRxId) return false;
    const res = await fetch(`${baseUrl}/api/prescriptions/${createdRxId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.status === 'APPROVED';
  });

  // 8. POST /api/prescriptions/[id]/dispense
  await test('POST /api/prescriptions/[id]/dispense records dispensing event', async () => {
    if (!createdRxId) return false;
    const res = await fetch(`${baseUrl}/api/prescriptions/${createdRxId}/dispense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pharmacy_name: 'Apollo Pharmacy Sector 18' }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.status === 'DISPENSED';
  });

  // 9. Prevent duplicate dispensing
  await test('Duplicate dispensing of already dispensed prescription is blocked', async () => {
    if (!createdRxId) return false;
    const res = await fetch(`${baseUrl}/api/prescriptions/${createdRxId}/dispense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pharmacy_name: 'MedPlus' }),
    });
    const data = await res.json();
    return res.status === 409 && data.success === false;
  });

  // 10. GET /api/records
  await test('GET /api/records returns encrypted health records archive', async () => {
    const res = await fetch(`${baseUrl}/api/records`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 5;
  });

  // 11. POST /api/records
  let createdRecordId = '';
  await test('POST /api/records adds and archives new health record', async () => {
    const res = await fetch(`${baseUrl}/api/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Random Blood Glucose Test',
        category: 'BLOOD_TEST',
        record_date: '2026-10-10',
        doctor_or_institution: 'City Diagnostics Center',
        description: 'Postprandial blood sugar 128 mg/dL. Normal tolerance.',
        tags: ['Glucose', 'Diabetes', 'Screening'],
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success === true && data.data.id) {
      createdRecordId = data.data.id;
      return true;
    }
    return false;
  });

  // 12. PUT /api/records
  await test('PUT /api/records updates health record details', async () => {
    if (!createdRecordId) return false;
    const res = await fetch(`${baseUrl}/api/records`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: createdRecordId,
        notes: 'Verified by primary clinician.',
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.notes === 'Verified by primary clinician.';
  });

  // 13. DELETE /api/records
  await test('DELETE /api/records removes health record', async () => {
    if (!createdRecordId) return false;
    const res = await fetch(`${baseUrl}/api/records?id=${encodeURIComponent(createdRecordId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return res.status === 200 && data.success === true;
  });

  // 14. GET /api/audit
  await test('GET /api/audit returns verifiable audit log trail', async () => {
    const res = await fetch(`${baseUrl}/api/audit`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 3;
  });

  // 15. POST /api/match
  await test('POST /api/match executes deterministic 6-point comparison', async () => {
    const res = await fetch(`${baseUrl}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescribed: { medicine_name: 'Metformin', strength: '500 mg', frequency: 'BD' },
        stripItem: {
          id: 'test_strip',
          medicine_name: 'Metformin',
          generic_name: 'Metformin Hydrochloride',
          strength: '500 mg',
          batch_number: 'MET500A',
          expiry_date: 'Dec 2026',
        },
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.record.match_status === 'MATCHED';
  });

  // 16. GET /api/reminders
  let testReminderId = '';
  await test('GET /api/reminders generates deterministic schedule from active prescriptions', async () => {
    const res = await fetch(`${baseUrl}/api/reminders?patient_id=PAT-10452`);
    const data = await res.json();
    if (res.status === 200 && data.success === true && Array.isArray(data.reminders) && data.reminders.length > 0) {
      testReminderId = data.reminders[0].id;
      return typeof data.metrics?.adherence_rate === 'number';
    }
    return false;
  });

  // 17. POST /api/reminders
  await test('POST /api/reminders records adherence intake event with audit trail', async () => {
    if (!testReminderId) return false;
    const res = await fetch(`${baseUrl}/api/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reminder_id: testReminderId,
        status: 'TAKEN',
        patient_id: 'PAT-10452',
        medicine_name: 'Metformin 500mg',
        notes: 'Taken on schedule with water',
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.log.status === 'TAKEN';
  });

  // 18. GET /api/family
  await test('GET /api/family returns authorized caregiver delegations', async () => {
    const res = await fetch(`${baseUrl}/api/family?patient_id=PAT-10452`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.delegations) && data.delegations.length >= 2;
  });

  // 19. POST /api/family
  let createdDelegationId = '';
  await test('POST /api/family grants explicit caregiver access with scoped permissions', async () => {
    const res = await fetch(`${baseUrl}/api/family`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: 'PAT-10452',
        patient_name: 'Lolita Sharma',
        caregiver_name: 'Kavita Sharma',
        caregiver_phone: '+91 91234 56789',
        relationship: 'Daughter',
        permissions: ['VIEW_PRESCRIPTIONS', 'MANAGE_REMINDERS'],
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success === true && data.delegation.id) {
      createdDelegationId = data.delegation.id;
      return data.delegation.status === 'ACTIVE';
    }
    return false;
  });

  // 20. DELETE /api/family
  await test('DELETE /api/family revokes caregiver delegation immediately', async () => {
    if (!createdDelegationId) return false;
    const res = await fetch(`${baseUrl}/api/family?id=${createdDelegationId}&reason=Test revocation`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.delegation.status === 'REVOKED';
  });

  // 21. POST /api/prescriptions/[id]/amend
  let amendedRxId = '';
  await test('POST /api/prescriptions/[id]/amend preserves historical version and creates V2', async () => {
    const res = await fetch(`${baseUrl}/api/prescriptions/DS-10452/amend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amended_medicines: [
          {
            id: 'med-amended-1',
            medicine_name: 'Metformin Hydrochloride SR',
            strength: '850 mg',
            frequency: 'Once daily with dinner',
            duration: '30 days',
            dosage_form: 'Tablet',
            confidence_score: 1.0,
            confidence_level: 'HIGH',
            user_confirmed: true,
          },
        ],
        amendment_reason: 'Dose titration based on HbA1c lab result',
        doctor_name: 'Dr. Sarah Jenkins, MD',
        doctor_license: 'MCI-2018-9921',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success === true && data.new_prescription) {
      amendedRxId = data.new_prescription.id;
      return data.new_prescription.version === 2 && data.superseded_prescription_id === 'DS-10452';
    }
    return false;
  });

  // 22. POST & GET /api/prescriptions/[id]/refill
  await test('POST & GET /api/prescriptions/[id]/refill handles refill workflow with doctor review', async () => {
    // A. Submit refill request
    const submitRes = await fetch(`${baseUrl}/api/prescriptions/RX-2026-0891/refill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requested_days: 30,
        reason: 'Monthly maintenance medication renewal',
      }),
    });
    const submitData = await submitRes.json();
    if (!submitRes.ok || !submitData.success || !submitData.refill_request?.id) return false;

    const refillId = submitData.refill_request.id;

    // B. Doctor reviews refill request
    const reviewRes = await fetch(`${baseUrl}/api/prescriptions/RX-2026-0891/refill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'REVIEW',
        refill_id: refillId,
        status: 'APPROVED',
        doctor_name: 'Dr. Sarah Jenkins',
        notes: 'Refill approved for 30 days',
      }),
    });
    const reviewData = await reviewRes.json();
    return reviewRes.status === 200 && reviewData.success === true && reviewData.refill_request.status === 'APPROVED';
  });

  console.log('\n==============================================');
  console.log(`📊 BACKEND API TEST RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log('==============================================\n');

  if (passed === total) {
    console.log('🎉 ALL BACKEND APIS AND PERSISTENCE LAYERS ARE 100% OPERATIONAL!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME BACKEND API TESTS FAILED.');
    process.exit(1);
  }
}

runBackendApiTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
