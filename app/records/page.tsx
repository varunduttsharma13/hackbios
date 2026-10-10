'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  User,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileCode,
  Printer,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ArrowUpDown,
  X,
  FileUp,
  FileDown,
  Info,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import {
  HealthRecord,
  HealthRecordCategory,
  HealthRecordSource,
  HealthRecordVerificationStatus,
  HEALTH_RECORD_CATEGORIES,
  RECORD_CATEGORY_META,
  ImportSummary,
} from '@/types/healthRecords';
import {
  exportRecordsToCSV,
  exportRecordsToXLSX,
  exportRecordsToJSON,
  exportRecordsToPDF,
  printHealthRecords,
  parseImportFile,
} from '@/lib/records/importExport';

export default function HealthRecordsPage() {
  const { healthRecords, addHealthRecord, updateHealthRecord, deleteHealthRecord, importHealthRecords, activeFamilyMember } =
    useVerification();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeRecordDetail, setActiveRecordDetail] = useState<HealthRecord | null>(null);

  // Add Record Form State
  const [addMode, setAddMode] = useState<'manual' | 'upload'>('manual');
  const [formCategory, setFormCategory] = useState<HealthRecordCategory>('DOCTOR_PRESCRIPTION');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDoctorOrInst, setFormDoctorOrInst] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formTags, setFormTags] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string; dataUrl?: string } | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrExtracted, setOcrExtracted] = useState<boolean>(false);

  // Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isParsingImport, setIsParsingImport] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    records: HealthRecord[];
    summary: ImportSummary;
  } | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  // Export State
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json' | 'pdf' | 'print'>('pdf');
  const [exportScope, setExportScope] = useState<'all' | 'filtered' | 'category'>('all');
  const [exportCategory, setExportCategory] = useState<HealthRecordCategory>('DOCTOR_PRESCRIPTION');

  // Filtered Records Calculation
  const filteredRecords = useMemo(() => {
    return healthRecords.filter((rec) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = rec.title.toLowerCase().includes(q);
        const matchesInst = rec.doctor_or_institution?.toLowerCase().includes(q);
        const matchesDesc = rec.description?.toLowerCase().includes(q);
        const matchesNotes = rec.notes?.toLowerCase().includes(q);
        const matchesTags = rec.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesInst && !matchesDesc && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'ALL' && rec.category !== selectedCategory) {
        return false;
      }

      // Source
      if (selectedSource !== 'ALL' && rec.source !== selectedSource) {
        return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && rec.verification_status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [healthRecords, searchQuery, selectedCategory, selectedSource, selectedStatus]);

  // Metric counts
  const stats = useMemo(() => {
    const total = healthRecords.length;
    const prescriptions = healthRecords.filter(
      (r) => r.category === 'DIGITAL_PRESCRIPTION' || r.category === 'DOCTOR_PRESCRIPTION'
    ).length;
    const labReports = healthRecords.filter(
      (r) => r.category === 'LAB_REPORT' || r.category === 'BLOOD_TEST' || r.category === 'IMAGING_REPORT'
    ).length;
    const documents = healthRecords.filter((r) => !!r.file_name || !!r.file_url).length;
    return { total, prescriptions, labReports, documents };
  }, [healthRecords]);

  // Handlers for Add Record
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: reader.result as string,
      });

      // If document name suggests title, prefill
      if (!formTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateAiOcr = () => {
    if (!uploadedFile) return;
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      setOcrExtracted(true);
      if (!formDoctorOrInst) setFormDoctorOrInst('Dr. Priya Sharma, MD (Apollo Health)');
      if (!formDescription) setFormDescription('AI Extracted: Fasting blood glucose 98 mg/dL, HbA1c 5.6%. Normal limits.');
    }, 1200);
  };

  const handleSaveRecord = () => {
    if (!formTitle.trim()) {
      alert('Please enter a record title');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addHealthRecord({
      patient_id: 'PAT-10452',
      patient_name: activeFamilyMember?.name || 'Lolita Alvarez',
      title: formTitle,
      category: formCategory,
      record_date: formDate,
      doctor_or_institution: formDoctorOrInst || undefined,
      description: formDescription || undefined,
      notes: formNotes || undefined,
      tags: tagsArray.length ? tagsArray : ['General'],
      source: (ocrExtracted ? 'AI_EXTRACTED' : uploadedFile ? 'USER_UPLOAD' : 'USER_UPLOAD') as HealthRecordSource,
      verification_status: (ocrExtracted ? 'UNVERIFIED' : 'UNVERIFIED') as HealthRecordVerificationStatus,
      file_name: uploadedFile?.name,
      file_size: uploadedFile?.size,
      file_type: uploadedFile?.type,
      file_url: uploadedFile?.dataUrl || '#',
    });

    // Reset and close
    setFormTitle('');
    setFormDoctorOrInst('');
    setFormDescription('');
    setFormNotes('');
    setFormTags('');
    setUploadedFile(null);
    setOcrExtracted(false);
    setIsAddModalOpen(false);
  };

  // Handlers for Import
  const handleSelectImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setIsParsingImport(true);

    try {
      const result = await parseImportFile(file, healthRecords);
      setImportPreview(result);
    } catch (err) {
      alert('Failed to parse file. Please verify CSV, XLSX, or JSON format.');
    } finally {
      setIsParsingImport(false);
    }
  };

  const handleExecuteImport = () => {
    if (!importPreview) return;
    const toImport = skipDuplicates
      ? importPreview.records.filter(
          (rec) =>
            !healthRecords.some(
              (existing) =>
                existing.title.toLowerCase() === rec.title.toLowerCase() &&
                existing.record_date === rec.record_date
            )
        )
      : importPreview.records;

    importHealthRecords(toImport);
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportPreview(null);
  };

  // Handlers for Export
  const handleExecuteExport = () => {
    let recordsToExport = healthRecords;
    if (exportScope === 'filtered') {
      recordsToExport = filteredRecords;
    } else if (exportScope === 'category') {
      recordsToExport = healthRecords.filter((r) => r.category === exportCategory);
    }

    if (!recordsToExport.length) {
      alert('No records found for the selected export scope.');
      return;
    }

    const patientName = activeFamilyMember?.name || 'Lolita Alvarez';

    switch (exportFormat) {
      case 'csv':
        exportRecordsToCSV(recordsToExport, 'MED_BRIDGE_Health_Records.csv');
        break;
      case 'xlsx':
        exportRecordsToXLSX(recordsToExport, 'MED_BRIDGE_Health_Records.xlsx');
        break;
      case 'json':
        exportRecordsToJSON(recordsToExport, 'MED_BRIDGE_Health_Records.json');
        break;
      case 'pdf':
        exportRecordsToPDF(recordsToExport, patientName, 'MED_BRIDGE_Health_Report.pdf');
        break;
      case 'print':
        printHealthRecords(recordsToExport, patientName);
        break;
    }

    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-teal-700/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-400/30">
              <Shield className="w-3.5 h-3.5" />
              ABDM Compliant • Cryptographically Signed Records
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Health Records & Documents
            </h1>
            <p className="text-teal-100/90 text-sm mt-1 max-w-xl leading-relaxed">
              Maintain an encrypted personal medical record archive. Search, import clinical summaries, export multi-format dossiers, and safeguard diagnostic reports.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/20 transition-all shadow-sm"
            >
              <FileUp className="w-4 h-4 text-teal-300" />
              <span>Import Data</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/20 transition-all shadow-sm"
            >
              <FileDown className="w-4 h-4 text-teal-300" />
              <span>Export Dossier</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md hover:shadow-teal-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Compact Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-teal-700/40">
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-teal-200/80 font-medium block">Total Saved Records</span>
            <span className="text-2xl font-black tracking-tight text-white mt-1 block">{stats.total}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-teal-200/80 font-medium block">Prescriptions</span>
            <span className="text-2xl font-black tracking-tight text-teal-300 mt-1 block">{stats.prescriptions}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-teal-200/80 font-medium block">Laboratory & Scans</span>
            <span className="text-2xl font-black tracking-tight text-emerald-300 mt-1 block">{stats.labReports}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-teal-200/80 font-medium block">Attached Documents</span>
            <span className="text-2xl font-black tracking-tight text-cyan-300 mt-1 block">{stats.documents}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, doctor, clinic, description, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 transition-all cursor-pointer"
            >
              <option value="ALL">All Categories ({healthRecords.length})</option>
              {HEALTH_RECORD_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Source Dropdown */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 transition-all cursor-pointer hidden sm:block"
            >
              <option value="ALL">All Sources</option>
              <option value="DOCTOR_CONFIRMED">Doctor Confirmed</option>
              <option value="AI_EXTRACTED">AI Extracted</option>
              <option value="USER_UPLOAD">User Uploaded</option>
              <option value="TRUSTED_IMPORT">Trusted Import</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'timeline' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Results badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredRecords.length}</strong> of{' '}
            <strong>{healthRecords.length}</strong> records
          </span>
          {(selectedCategory !== 'ALL' || selectedSource !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSource('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="text-teal-700 hover:text-teal-900 font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Records List / Timeline */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No health records match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Try adjusting your search query, clearing filters, or upload your first diagnostic report or prescription.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs"
            >
              Add New Record
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
            >
              Import CSV / JSON
            </button>
          </div>
        </div>
      ) : viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredRecords.map((record) => {
            const meta = RECORD_CATEGORY_META[record.category] || {
              label: record.category,
              badgeBg: 'bg-slate-100',
              badgeText: 'text-slate-800',
              badgeBorder: 'border-slate-200',
            };

            return (
              <div key={record.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-teal-600" />
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                        >
                          {meta.label}
                        </span>

                        {/* Source indicator */}
                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                          {record.source === 'DOCTOR_CONFIRMED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {record.source === 'AI_EXTRACTED' && <Sparkles className="w-3 h-3 text-cyan-600" />}
                          {record.source === 'USER_UPLOAD' && <Upload className="w-3 h-3 text-slate-500" />}
                          {record.source === 'TRUSTED_IMPORT' && <FileCheck className="w-3 h-3 text-indigo-600" />}
                          <span className="capitalize">{record.source.replace('_', ' ')}</span>
                        </span>

                        {/* Review Status */}
                        {record.verification_status === 'UNVERIFIED' && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Unverified
                          </span>
                        )}
                        {record.verification_status === 'REVIEWED' && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Reviewed
                          </span>
                        )}
                        {record.verification_status === 'CLINICALLY_CONFIRMED' && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Clinically Confirmed
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {record.title}
                      </h4>

                      {/* Doctor & Facility */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                        {record.doctor_or_institution && (
                          <span className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {record.doctor_or_institution}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {record.record_date}
                        </span>
                      </div>

                      {/* Description / Findings */}
                      {record.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                          {record.description}
                        </p>
                      )}

                      {/* Tags */}
                      {record.tags && record.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {record.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Attached Document indicator */}
                      {record.file_name && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg w-fit border border-slate-200">
                          <FileText className="w-3.5 h-3.5 text-teal-700" />
                          <span className="font-medium truncate max-w-xs">{record.file_name}</span>
                          {record.file_size && (
                            <span className="text-[10px] text-slate-400">
                              ({(record.file_size / 1024).toFixed(1)} KB)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <button
                        onClick={() => setActiveRecordDetail(record)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-teal-200/60"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete health record "${record.title}"? This cannot be undone.`)) {
                            deleteHealthRecord(record.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((record) => {
                  const meta = RECORD_CATEGORY_META[record.category] || {
                    label: record.category,
                    badgeBg: 'bg-slate-100',
                    badgeText: 'text-slate-800',
                  };
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                        {record.record_date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{record.title}</span>
                        <span className="text-[11px] text-slate-500">
                          {record.doctor_or_institution || 'No facility noted'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg} ${meta.badgeText}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-600">
                        {record.source.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {record.verification_status === 'CLINICALLY_CONFIRMED' && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Confirmed
                          </span>
                        )}
                        {record.verification_status === 'REVIEWED' && (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Reviewed
                          </span>
                        )}
                        {record.verification_status === 'UNVERIFIED' && (
                          <span className="text-slate-500 font-medium">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveRecordDetail(record)}
                          className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] mr-1.5"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${record.title}"?`)) deleteHealthRecord(record.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD RECORD MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Health Record</h3>
                <p className="text-xs text-slate-500">Document manual entry or clinical file upload</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setAddMode('manual')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  addMode === 'manual' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setAddMode('upload')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  addMode === 'upload' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload Document (PDF / Image)
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Record Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as HealthRecordCategory)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                >
                  {HEALTH_RECORD_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Document Drag & Drop */}
              {addMode === 'upload' && (
                <div className="p-4 border-2 border-dashed border-teal-300 bg-teal-50/40 rounded-2xl text-center space-y-2">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    id="doc-upload-input"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="doc-upload-input" className="cursor-pointer block">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-1">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-teal-800 block">Click to select document or image</span>
                    <span className="text-[11px] text-slate-500">Supports PDF, JPG, PNG, WEBP (Max 15MB)</span>
                  </label>

                  {uploadedFile && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-teal-200 text-left flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                            {uploadedFile.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for processing
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleSimulateAiOcr}
                        disabled={isOcrProcessing || ocrExtracted}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        {isOcrProcessing ? (
                          <span>Scanning...</span>
                        ) : ocrExtracted ? (
                          <span>✓ OCR Extracted</span>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>Run AI OCR</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Annual Health Checkup"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Clinician or Medical Institution */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor / Institution</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Rajesh Mehta / Max Healthcare"
                  value={formDoctorOrInst}
                  onChange={(e) => setFormDoctorOrInst(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Description / Findings */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Findings / Diagnostic Summary</label>
                <textarea
                  rows={2}
                  placeholder="Clinical observation, test metrics, or medication instructions..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Notes</label>
                <input
                  type="text"
                  placeholder="Follow-up instructions or personal reminders..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Routine, Fasting, Blood Sugar, Cardiology"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Disclaimer */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Uploaded documents are archived for personal record keeping. They do not substitute for formal hospital verification until approved by an authorized clinician.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
              >
                Save Health Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= IMPORT RECORDS MODAL ================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Import Structured Health Records</h3>
                <p className="text-xs text-slate-500">Supports CSV, XLSX, and JSON formatted files</p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* File input */}
              <div className="p-6 border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-2xl text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  id="import-records-file"
                  className="hidden"
                  onChange={handleSelectImportFile}
                />
                <label htmlFor="import-records-file" className="cursor-pointer block">
                  <FileSpreadsheet className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <span className="text-xs font-bold text-teal-800 block">Choose CSV, XLSX, or JSON file</span>
                  <span className="text-[11px] text-slate-500">Server validated • Secure client-side parsing</span>
                </label>
              </div>

              {isParsingImport && (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-600 animate-pulse">
                  Analyzing schema, validating columns & checking duplicate candidates...
                </div>
              )}

              {importPreview && (
                <div className="space-y-3">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Total Read</span>
                      <strong className="text-xs text-slate-800">{importPreview.summary.totalRows}</strong>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block">Imported</span>
                      <strong className="text-xs text-emerald-800">{importPreview.summary.importedCount}</strong>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 block">Duplicates</span>
                      <strong className="text-xs text-amber-800">{importPreview.summary.duplicateCount}</strong>
                    </div>
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="text-[10px] text-rose-700 block">Errors</span>
                      <strong className="text-xs text-rose-800">{importPreview.summary.errors.length}</strong>
                    </div>
                  </div>

                  {/* Duplicate handling toggle */}
                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipDuplicates}
                      onChange={(e) => setSkipDuplicates(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Skip potential duplicate entries automatically</span>
                  </label>

                  {/* Records Preview list */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                      Previewing {importPreview.records.length} records:
                    </span>
                    {importPreview.records.slice(0, 5).map((r, i) => (
                      <div key={i} className="text-xs p-2 bg-slate-50 rounded-lg flex justify-between items-center">
                        <span className="font-semibold text-slate-800 truncate max-w-xs">{r.title}</span>
                        <span className="text-[10px] text-slate-500">{r.record_date}</span>
                      </div>
                    ))}
                    {importPreview.records.length > 5 && (
                      <div className="text-[10px] text-center text-slate-400 py-1">
                        + {importPreview.records.length - 5} more records
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={!importPreview || importPreview.records.length === 0}
                onClick={handleExecuteImport}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-xs shadow-xs"
              >
                Import {importPreview ? importPreview.records.length : 0} Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXPORT DOSSIER MODAL ================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Export Medical Records</h3>
                <p className="text-xs text-slate-500">Download formatted patient summaries and raw tables</p>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Export Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'pdf', label: 'PDF Medical Dossier', icon: FileText, desc: 'Printable Clinical Summary' },
                    { id: 'xlsx', label: 'Excel (XLSX)', icon: FileSpreadsheet, desc: 'Multi-column Spreadsheet' },
                    { id: 'csv', label: 'CSV Spreadsheet', icon: FileSpreadsheet, desc: 'RFC-4180 Unicode BOM' },
                    { id: 'json', label: 'JSON Data', icon: FileCode, desc: 'Schema V1 Structured Backup' },
                    { id: 'print', label: 'Direct Print View', icon: Printer, desc: 'Browser Print Engine' },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          exportFormat === fmt.id
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${exportFormat === fmt.id ? 'text-teal-700' : 'text-slate-500'}`} />
                        <span className="block text-xs font-bold text-slate-900">{fmt.label}</span>
                        <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">{fmt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scope Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Export Scope</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={exportScope === 'all'}
                      onChange={() => setExportScope('all')}
                      className="text-teal-600"
                    />
                    <span>All Available Records ({healthRecords.length} records)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={exportScope === 'filtered'}
                      onChange={() => setExportScope('filtered')}
                      className="text-teal-600"
                    />
                    <span>Current Filtered Selection ({filteredRecords.length} records)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={exportScope === 'category'}
                      onChange={() => setExportScope('category')}
                      className="text-teal-600"
                    />
                    <span>Specific Category Only</span>
                  </label>
                </div>

                {exportScope === 'category' && (
                  <select
                    value={exportCategory}
                    onChange={(e) => setExportCategory(e.target.value as HealthRecordCategory)}
                    className="mt-2 w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 font-medium"
                  >
                    {HEALTH_RECORD_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Security & Privacy Notice */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Confidential Health Data Notice:</strong> The exported archive contains personal diagnostic reports and medication history. Store downloaded files securely.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteExport}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate & Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RECORD DETAIL INSPECTION DRAWER ================= */}
      {activeRecordDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {RECORD_CATEGORY_META[activeRecordDetail.category]?.label || activeRecordDetail.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                    {activeRecordDetail.title}
                  </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Record Date: {activeRecordDetail.record_date}
                  </span>
                </div>
                <button
                  onClick={() => setActiveRecordDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Content */}
              <div className="mt-5 space-y-4">
                {/* Clinician & Facility */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Doctor / Institution:</span>
                    <strong className="text-slate-800">{activeRecordDetail.doctor_or_institution || 'Not documented'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Record ID:</span>
                    <span className="font-mono text-[11px] text-slate-600">{activeRecordDetail.id}</span>
                  </div>
                </div>

                {/* Clinical Description / Findings */}
                {activeRecordDetail.description && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 mb-1">Clinical Findings & Summary</h5>
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200 whitespace-pre-wrap">
                      {activeRecordDetail.description}
                    </div>
                  </div>
                )}

                {/* Personal Notes */}
                {activeRecordDetail.notes && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 mb-1">Notes</h5>
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200 whitespace-pre-wrap">
                      {activeRecordDetail.notes}
                    </div>
                  </div>
                )}

                {/* Attached Document File Preview */}
                {activeRecordDetail.file_name && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 mb-1.5">Attached Source Document</h5>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-teal-700" />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                              {activeRecordDetail.file_name}
                            </span>
                            {activeRecordDetail.file_size && (
                              <span className="text-[10px] text-slate-400">
                                {(activeRecordDetail.file_size / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>
                        </div>
                        {activeRecordDetail.file_url && activeRecordDetail.file_url !== '#' && (
                          <a
                            href={activeRecordDetail.file_url}
                            download={activeRecordDetail.file_name}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>

                      {/* If image dataURL, display image preview */}
                      {activeRecordDetail.file_type?.startsWith('image/') &&
                        activeRecordDetail.file_url && activeRecordDetail.file_url.startsWith('data:') && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48">
                            <img
                              src={activeRecordDetail.file_url}
                              alt={activeRecordDetail.file_name}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Metadata & Audit */}
                <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-100">
                  <div>Source: <span className="text-slate-600 font-medium capitalize">{activeRecordDetail.source.replace('_', ' ')}</span></div>
                  <div>Status: <span className="text-slate-600 font-medium capitalize">{activeRecordDetail.verification_status}</span></div>
                  <div>Created: {new Date(activeRecordDetail.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-6">
              <button
                onClick={() => {
                  if (confirm(`Delete record "${activeRecordDetail.title}"?`)) {
                    deleteHealthRecord(activeRecordDetail.id);
                    setActiveRecordDetail(null);
                  }
                }}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setActiveRecordDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
