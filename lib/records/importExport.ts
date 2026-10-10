import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { HealthRecord, HealthRecordCategory, ImportOptions, ImportSummary, HEALTH_RECORD_CATEGORIES } from '@/types/healthRecords';

/**
 * Clean & normalize a CSV field for RFC-4180 compliance
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export Health Records to CSV with UTF-8 BOM (preserves Hindi & international text)
 */
export function exportRecordsToCsv(records: HealthRecord[], filename = 'MED_BRIDGE_Health_Records.csv') {
  const headers = [
    'Record ID',
    'Title',
    'Category',
    'Record Date',
    'Doctor or Institution',
    'Description',
    'Tags',
    'Source',
    'Verification Status',
    'Notes',
    'File Name',
  ];

  const rows = records.map((r) => [
    escapeCsvValue(r.id),
    escapeCsvValue(r.title),
    escapeCsvValue(r.category),
    escapeCsvValue(r.record_date),
    escapeCsvValue(r.doctor_or_institution || ''),
    escapeCsvValue(r.description || ''),
    escapeCsvValue(r.tags ? r.tags.join('; ') : ''),
    escapeCsvValue(r.source),
    escapeCsvValue(r.verification_status),
    escapeCsvValue(r.notes || ''),
    escapeCsvValue(r.file_name || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBrowserDownload(blob, filename);
}

/**
 * Export Health Records to Excel (.xlsx) using SheetJS
 */
export function exportRecordsToXlsx(records: HealthRecord[], filename = 'MED_BRIDGE_Health_Records.xlsx') {
  const data = records.map((r) => ({
    'Record ID': r.id,
    'Title': r.title,
    'Category': HEALTH_RECORD_CATEGORIES.find((c) => c.key === r.category)?.label || r.category,
    'Record Date': r.record_date,
    'Doctor or Institution': r.doctor_or_institution || '—',
    'Description': r.description || '—',
    'Tags': r.tags ? r.tags.join(', ') : '',
    'Source': r.source,
    'Verification Status': r.verification_status,
    'Notes': r.notes || '—',
    'Attachment Name': r.file_name || 'None',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-calculate column widths
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length + 4, 15),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Health Records');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  triggerBrowserDownload(blob, filename);
}

/**
 * Export Health Records to Structured JSON
 */
export function exportRecordsToJson(records: HealthRecord[], filename = 'MED_BRIDGE_Health_Records.json') {
  const exportPayload = {
    schemaVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    system: 'MED-BRIDGE Healthcare Network',
    totalRecords: records.length,
    records,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  triggerBrowserDownload(blob, filename);
}

/**
 * Export Health Records to Printable PDF Summary Report using jsPDF
 */
export function exportRecordsToPdf(
  records: HealthRecord[],
  patientName = 'Lolita Alvarez',
  filename = 'MED_BRIDGE_Health_Report.pdf'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 118, 110); // #0F766E Brand Teal
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MED-BRIDGE HEALTH NETWORK', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Personal Health Records Summary & Clinical Audit Report', 14, 18);

  // Metadata Box
  doc.setTextColor(24, 37, 34); // text-slate-900
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient Name: ${patientName}`, 14, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, 14, 40);
  doc.text(`Total Records Included: ${records.length}`, 14, 45);

  doc.setDrawColor(228, 233, 229); // border
  doc.line(14, 49, pageWidth - 14, 49);

  let yPosition = 55;

  records.forEach((record, index) => {
    // Check if space is running out on page
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    const categoryLabel = HEALTH_RECORD_CATEGORIES.find((c) => c.key === record.category)?.label || record.category;

    // Card background
    doc.setFillColor(248, 250, 249);
    doc.roundedRect(14, yPosition, pageWidth - 28, 28, 2, 2, 'F');
    doc.setDrawColor(228, 233, 229);
    doc.roundedRect(14, yPosition, pageWidth - 28, 28, 2, 2, 'S');

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${record.title.slice(0, 55)}${record.title.length > 55 ? '...' : ''}`, 18, yPosition + 6);

    // Metadata Row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${categoryLabel}  |  Date: ${record.record_date}  |  Status: ${record.verification_status}`, 18, yPosition + 12);

    // Doctor/Institution
    if (record.doctor_or_institution) {
      doc.text(`Institution / Clinician: ${record.doctor_or_institution.slice(0, 70)}`, 18, yPosition + 17);
    }

    // Description
    if (record.description) {
      doc.setTextColor(51, 65, 85);
      doc.text(doc.splitTextToSize(record.description, pageWidth - 36).slice(0, 2), 18, yPosition + 22);
    }

    yPosition += 32;
  });

  // Footer Disclaimer
  if (yPosition > 270) {
    doc.addPage();
    yPosition = 20;
  }
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'MED-BRIDGE Health Records are user-managed documents. Uploaded records require physical verification by licensed healthcare providers before clinical decisions.',
    14,
    yPosition + 8
  );

  doc.save(filename);
}

export const exportRecordsToCSV = exportRecordsToCsv;
export const exportRecordsToXLSX = exportRecordsToXlsx;
export const exportRecordsToJSON = exportRecordsToJson;
export const exportRecordsToPDF = exportRecordsToPdf;

/**
 * Helper to trigger browser download
 */
function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Direct Print View Engine
 */
export function printHealthRecords(records: HealthRecord[], patientName = 'Lolita Alvarez') {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print medical records.');
    return;
  }
  const rowsHtml = records
    .map(
      (r, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold;">${idx + 1}</td>
      <td style="padding: 8px;"><strong>${r.title}</strong><br/><small style="color: #64748b;">${r.doctor_or_institution || '—'}</small></td>
      <td style="padding: 8px;">${r.category}</td>
      <td style="padding: 8px;">${r.record_date}</td>
      <td style="padding: 8px;">${r.source}</td>
      <td style="padding: 8px;">${r.verification_status}</td>
    </tr>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MED-BRIDGE — Health Records Summary</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; }
          h1 { color: #0f766e; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background: #f8fafc; padding: 8px; text-align: left; border-bottom: 2px solid #cbd5e1; }
        </style>
      </head>
      <body>
        <h1>MED-BRIDGE HEALTH NETWORK</h1>
        <p><strong>Patient:</strong> ${patientName} &bull; <strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr><th>#</th><th>Record Details</th><th>Category</th><th>Date</th><th>Source</th><th>Status</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

/**
 * Universal file importer for CSV, XLSX, and JSON
 */
export async function parseImportFile(file: File, existingRecords: HealthRecord[]) {
  const fileName = file.name.toLowerCase();
  let rawRows: any[] = [];

  if (fileName.endsWith('.csv')) {
    const text = await file.text();
    rawRows = parseCsvRecords(text);
  } else if (fileName.endsWith('.json')) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    rawRows = Array.isArray(parsed) ? parsed : parsed.records || [];
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[firstSheetName];
    rawRows = XLSX.utils.sheet_to_json(sheet);
  } else {
    throw new Error('Unsupported format. Please select a CSV, XLSX, or JSON file.');
  }

  const summary = processImportRows(
    rawRows,
    existingRecords,
    { duplicateHandling: 'SKIP' },
    'PAT-10452',
    'Lolita Alvarez'
  );

  return {
    records: summary.importedRecords,
    summary,
  };
}

export const importStructuredRows = processImportRows;

/**
 * Parse an uploaded CSV file text into candidate health records
 */
export function parseCsvRecords(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());

  const results: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length === 0 || values.every((v) => !v.trim())) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    results.push(rowObj);
  }

  return results;
}

/**
 * RFC-4180 compliant CSV line parser supporting quoted fields and embedded commas
 */
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  values.push(currentVal.trim());
  return values;
}

/**
 * Parse an Excel file (ArrayBuffer) into rows using SheetJS
 */
export function parseXlsxRecords(buffer: ArrayBuffer): any[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const worksheet = workbook.Sheets[firstSheetName];
  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  return rawData;
}

/**
 * Process and validate parsed rows into HealthRecord items
 */
export function processImportRows(
  rows: any[],
  existingRecords: HealthRecord[],
  options: ImportOptions,
  patientId: string,
  patientName: string
): ImportSummary {
  const summary: ImportSummary = {
    totalRows: rows.length,
    importedCount: 0,
    skippedCount: 0,
    duplicateCount: 0,
    errors: [],
    importedRecords: [],
  };

  const newRecords: HealthRecord[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 1;

    // Normalize keys (case-insensitive & flexible column headers)
    const normalized: Record<string, string> = {};
    Object.keys(row).forEach((k) => {
      normalized[k.toLowerCase().replace(/[^a-z0-9]/g, '')] = String(row[k]).trim();
    });

    const title =
      normalized['title'] ||
      normalized['recordtitle'] ||
      normalized['name'] ||
      normalized['documentname'] ||
      '';

    if (!title) {
      summary.errors.push({
        row: rowNum,
        error: 'Missing required field: "Title" or "Record Title"',
        rawData: row,
      });
      summary.skippedCount++;
      return;
    }

    // Category resolution
    const categoryRaw =
      normalized['category'] ||
      normalized['recordcategory'] ||
      normalized['type'] ||
      options.defaultCategory ||
      'OTHER_DOCUMENT';

    const matchedCategory = resolveCategory(categoryRaw);

    // Date resolution
    const recordDate =
      normalized['recorddate'] ||
      normalized['date'] ||
      new Date().toISOString().slice(0, 10);

    const doctorOrInst =
      normalized['doctororinstitution'] ||
      normalized['doctor'] ||
      normalized['hospital'] ||
      normalized['institution'] ||
      '';

    const description = normalized['description'] || normalized['details'] || '';
    const tagsRaw = normalized['tags'] || normalized['tag'] || '';
    const tags = tagsRaw
      ? tagsRaw.split(/[;,]/).map((t: string) => t.trim()).filter(Boolean)
      : [];

    const notes = normalized['notes'] || normalized['comment'] || '';

    // Duplicate detection based on Title + Date + Category
    const isDuplicate = existingRecords.some(
      (existing) =>
        existing.title.toLowerCase() === title.toLowerCase() &&
        existing.record_date === recordDate &&
        existing.category === matchedCategory
    );

    if (isDuplicate) {
      summary.duplicateCount++;
      if (options.duplicateHandling === 'SKIP') {
        summary.skippedCount++;
        return;
      }
    }

    const createdRecord: HealthRecord = {
      id: `REC_IMP_${Date.now()}_${index}`,
      patient_id: patientId,
      patient_name: patientName,
      title,
      category: matchedCategory,
      record_date: recordDate,
      doctor_or_institution: doctorOrInst || undefined,
      description: description || undefined,
      tags,
      source: 'TRUSTED_IMPORT',
      verification_status: 'UNVERIFIED',
      notes: notes || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    newRecords.push(createdRecord);
    summary.importedCount++;
  });

  summary.importedRecords = newRecords;
  return summary;
}

/**
 * Match flexible category strings into canonical HealthRecordCategory
 */
function resolveCategory(catStr: string): HealthRecordCategory {
  const clean = catStr.toUpperCase().replace(/[^A-Z]/g, '');

  if (clean.includes('BLOOD')) return 'BLOOD_TEST';
  if (clean.includes('LAB') || clean.includes('TEST')) return 'LAB_REPORT';
  if (clean.includes('DIGITAL') || clean.includes('ERX')) return 'DIGITAL_PRESCRIPTION';
  if (clean.includes('PRESCRIPTION') || clean.includes('RX')) return 'DOCTOR_PRESCRIPTION';
  if (clean.includes('IMAGING') || clean.includes('XRAY') || clean.includes('MRI') || clean.includes('CT')) return 'IMAGING_REPORT';
  if (clean.includes('ALLERGY')) return 'ALLERGY_RECORD';
  if (clean.includes('VACCIN') || clean.includes('IMMUN')) return 'VACCINATION';
  if (clean.includes('DISCHARGE') || clean.includes('SURGERY')) return 'DISCHARGE_SUMMARY';
  if (clean.includes('CERTIFICATE')) return 'MEDICAL_CERTIFICATE';
  if (clean.includes('CONDITION') || clean.includes('DIAGNOSIS')) return 'MEDICAL_CONDITION';
  if (clean.includes('MEDICINE') || clean.includes('DRUG')) return 'MEDICINE_HISTORY';
  if (clean.includes('NOTE') || clean.includes('VISIT')) return 'DOCTOR_VISIT_NOTE';

  return 'OTHER_DOCUMENT';
}
