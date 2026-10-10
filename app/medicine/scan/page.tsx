'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  QrCode,
  Barcode,
  Zap,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  FileSearch,
  RotateCcw,
  ShieldCheck,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { apiRequest } from '@/lib/api/client';
import { MedicineRegistryItem } from '@/types/medicine';

export default function MedicineScanPage() {
  const router = useRouter();
  const { setScannedStrip } = useVerification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scanTab, setScanTab] = useState<'QR' | 'BARCODE' | 'MEDIA'>('MEDIA');
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Media upload & OCR text analysis state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [extractedResult, setExtractedResult] = useState<MedicineRegistryItem | null>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setExtractedResult(null);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Strip Presets for Quick Testing
  const handleSelectSampleStrip = (sampleKey: 'MET' | 'AZI' | 'ATO' | 'PAN' | 'PAR' | 'FES' | 'ASC') => {
    const samples: Record<string, { name: string; url: string; file: string }> = {
      FES: {
        name: 'Ferrous Sulfate 325mg (FeSO4 Blister Strip)',
        url: '/demo/sample_feso4_strip.svg',
        file: 'feso4_325mg_strip.jpg',
      },
      ASC: {
        name: 'Ascorbic Acid 100mg (Vitamin C Blister Strip)',
        url: '/demo/sample_ascorbic_strip.svg',
        file: 'ascorbic_acid_100mg_strip.jpg',
      },
      MET: {
        name: 'Metformin 500mg Blister Pack',
        url: '/demo/sample_metformin_strip.png',
        file: 'metformin_500mg_strip.jpg',
      },
      AZI: {
        name: 'Azithromycin 500mg Blister Strip',
        url: '/demo/sample_azithromycin_strip.png',
        file: 'azithromycin_500mg_strip.jpg',
      },
      ATO: {
        name: 'Atorvastatin 10mg Blister Strip',
        url: '/demo/sample_atorvastatin_strip.png',
        file: 'atorvastatin_10mg_strip.jpg',
      },
      PAN: {
        name: 'Pantoprazole 40mg (Expired Batch)',
        url: '/demo/sample_pantoprazole_strip.png',
        file: 'pantoprazole_40mg_expired.jpg',
      },
      PAR: {
        name: 'Paracetamol 500mg (CDSCO Recalled)',
        url: '/demo/sample_paracetamol_strip.png',
        file: 'paracetamol_500mg_recall.jpg',
      },
      OPX: {
        name: 'T. Opox-CV 200mg (Cefpodoxime Proxetil)',
        url: '/demo/sample_feso4_strip.svg',
        file: 'opox_200mg_strip.jpg',
      },
      AMP: {
        name: 'Amphojel 120ml (Aluminum Hydroxide Gel)',
        url: '/demo/sample_ascorbic_strip.svg',
        file: 'amphojel_120ml_bottle.jpg',
      },
    };

    const s = samples[sampleKey];
    setUploadedImage(s.url);
    setUploadedFileName(s.file);
    setExtractedResult(null);
    setErrorMsg('');
  };

  // Run Vision OCR Image Text Analysis
  const analyzeStripMediaText = async (customImage?: string, customName?: string) => {
    const imgData = customImage || uploadedImage;
    const fName = customName || uploadedFileName;

    if (!imgData) {
      setErrorMsg('Please upload or capture a medicine strip image first.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      setAnalysisStep('Scanning packaging texture & typography...');
      await new Promise((res) => setTimeout(res, 500));

      setAnalysisStep('Detecting printed brand, salt & dosage strength...');
      await new Promise((res) => setTimeout(res, 500));

      setAnalysisStep('Extracting batch number, mfg & expiry date...');
      await new Promise((res) => setTimeout(res, 400));

      setAnalysisStep('Validating with CDSCO national registry...');

      const response = await apiRequest<{
        success: boolean;
        data: MedicineRegistryItem;
        scan_info?: any;
      }>('/api/medicine/scan', {
        method: 'POST',
        body: JSON.stringify({
          scanType: 'MEDIA_UPLOAD',
          imageBase64: imgData,
          fileName: fName,
          hintText: fName,
        }),
      });

      if (response.success && response.data) {
        setExtractedResult(response.data);
        setScannedStrip(response.data);
      } else {
        throw new Error('Could not analyze text on packaging.');
      }
    } catch {
      setErrorMsg('Text analysis failed or image was unreadable. Please retry or adjust lighting.');
    } finally {
      setIsVerifying(false);
      setAnalysisStep('');
    }
  };

  // Process QR / Barcode Scan Code
  const processScanCode = async (code: string) => {
    setIsVerifying(true);
    setErrorMsg('');

    try {
      await new Promise((res) => setTimeout(res, 600));
      const response = await apiRequest<{ success: boolean; data: MedicineRegistryItem }>('/api/medicine/scan', {
        method: 'POST',
        body: JSON.stringify({ code, scanType: scanTab }),
      });
      const item = response.data;

      if (item) {
        setScannedStrip(item);
        router.push('/medicine/verify');
      } else {
        setErrorMsg(`Product code "${code}" not found in trusted registry.`);
      }
    } catch {
      setErrorMsg('Registry lookup error. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleProceedToVerify = () => {
    if (extractedResult) {
      setScannedStrip(extractedResult);
      router.push('/medicine/verify');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0B0F17] text-white flex flex-col justify-between p-3 sm:p-4 relative overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between z-20 pt-1">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* 3-Mode Switcher: Media / QR / Barcode */}
        <div className="flex bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 text-xs">
          <button
            onClick={() => {
              setScanTab('MEDIA');
              setErrorMsg('');
            }}
            className={`px-3 py-1.5 rounded-full font-black flex items-center gap-1.5 transition-all ${
              scanTab === 'MEDIA' ? 'bg-[#14B8A6] text-[#0B0F17] shadow-md shadow-[#14B8A6]/30' : 'text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload Media
          </button>
          <button
            onClick={() => {
              setScanTab('QR');
              setErrorMsg('');
            }}
            className={`px-3 py-1.5 rounded-full font-black transition-all ${
              scanTab === 'QR' ? 'bg-[#14B8A6] text-[#0B0F17] shadow-md shadow-[#14B8A6]/30' : 'text-slate-300'
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => {
              setScanTab('BARCODE');
              setErrorMsg('');
            }}
            className={`px-3 py-1.5 rounded-full font-black transition-all ${
              scanTab === 'BARCODE' ? 'bg-[#14B8A6] text-[#0B0F17] shadow-md shadow-[#14B8A6]/30' : 'text-slate-300'
            }`}
          >
            Barcode
          </button>
        </div>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2.5 rounded-full backdrop-blur-md border transition-colors ${
            flashOn ? 'bg-[#F59E0B] text-black border-[#F59E0B]' : 'bg-white/10 text-white border-white/15'
          }`}
        >
          <Zap className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport Content */}
      <div className="my-auto py-4 z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {scanTab === 'MEDIA' ? (
          /* MEDIA UPLOAD & OCR MODE */
          <div className="w-full space-y-4">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!uploadedImage ? (
              /* Dropzone / Upload Prompt */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-teal-500/40 hover:border-teal-400 bg-slate-900/60 hover:bg-slate-900/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all backdrop-blur-sm group"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-white mb-1">Upload Medicine Strip Photo</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-3">
                  Take a photo or upload an image of the blister pack, foil backing, or packaging box to analyze text.
                </p>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Tap to Browse or Capture Photo
                </span>
              </div>
            ) : (
              /* Image Uploaded Preview with OCR Viewfinder */
              <div className="relative w-full rounded-2xl overflow-hidden border border-teal-500/40 bg-black/80 shadow-2xl">
                {/* Image Display */}
                <div className="w-full h-56 sm:h-64 relative flex items-center justify-center bg-black/90 overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Medicine Strip"
                    className="w-full h-full object-contain filter contrast-105"
                  />
                  {/* Optical Scanning Line */}
                  {isVerifying && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#14B8A6] animate-pulse" />
                  )}

                  {/* Corner Targets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-teal-400" />
                </div>

                {/* Top Badge on image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-black/70 text-teal-300 border border-white/20 backdrop-blur-md">
                    {uploadedFileName || 'Strip Photo'}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="pointer-events-auto text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/70 text-white hover:text-teal-300 border border-white/20 backdrop-blur-md flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Change
                  </button>
                </div>

                {/* Bottom Action inside Image */}
                {!extractedResult && !isVerifying && (
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-teal-300">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>Ready for Vision OCR</span>
                    </div>
                    <button
                      onClick={() => analyzeStripMediaText()}
                      className="px-3.5 py-2 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <FileSearch className="w-4 h-4" /> Analyse Strip Text
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Text Result Card */}
            {extractedResult && (
              <div className="p-4 rounded-2xl bg-white text-slate-900 border border-teal-500 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{extractedResult.medicine_name}</h4>
                      <p className="text-[11px] text-teal-700 font-medium">{extractedResult.generic_name}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {extractedResult.confidence_score || 95}% OCR CONFIDENCE
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Dosage Strength</span>
                    <span className="font-bold text-slate-900">{extractedResult.strength}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Batch Number</span>
                    <span className="font-mono font-semibold text-slate-900">{extractedResult.batch_number}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Expiry Date</span>
                    <span className="font-bold text-slate-900">{extractedResult.expiry_date}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Manufacturer</span>
                    <span className="font-medium text-slate-900 truncate block">{extractedResult.manufacturer}</span>
                  </div>
                </div>

                {/* Detected Raw OCR Text Banner */}
                {extractedResult.detected_raw_text && (
                  <div className="p-2.5 bg-[#F8FAF9] rounded-xl border border-[#D5E2DC] text-[10px]">
                    <span className="font-black text-[#4A6357] uppercase text-[9px] block mb-0.5">
                      Detected Packaging Text:
                    </span>
                    <p className="font-mono text-[#0A1C16] leading-tight break-words">
                      "{extractedResult.detected_raw_text}"
                    </p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleProceedToVerify}
                  className="w-full py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-[#0B0F17] font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" /> Proceed to Clinical Verification →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* QR / BARCODE LIVE SCANNER BOX */
          <div className="w-64 h-64 border-2 border-dashed border-[#14B8A6] rounded-3xl p-4 flex flex-col justify-between relative bg-black/60 backdrop-blur-xs">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-t-4 border-l-4 border-[#14B8A6] rounded-tl-lg" />
              <div className="w-6 h-6 border-t-4 border-r-4 border-[#14B8A6] rounded-tr-lg" />
            </div>

            {/* Laser Line */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#14B8A6] to-transparent shadow-[0_0_15px_#14B8A6] animate-pulse" />

            {/* Graphic Icon */}
            <div className="mx-auto w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center opacity-90">
              {scanTab === 'QR' ? (
                <QrCode className="w-full h-full text-[#0B0F17]" />
              ) : (
                <Barcode className="w-full h-full text-[#0B0F17]" />
              )}
            </div>

            <div className="flex justify-between">
              <div className="w-6 h-6 border-b-4 border-l-4 border-[#14B8A6] rounded-bl-lg" />
              <div className="w-6 h-6 border-b-4 border-r-4 border-[#14B8A6] rounded-br-lg" />
            </div>
          </div>
        )}
      </div>

      {/* Verifying Overlay with Animated Multi-step Progress */}
      {isVerifying && (
        <div className="absolute inset-0 bg-[#0B0F17]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center z-30 space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#14B8A6]/30 border-t-[#14B8A6] animate-spin" />
          <div className="space-y-1">
            <p className="text-base font-black text-[#14B8A6]">Analyzing Packaging Media</p>
            <p className="text-xs text-slate-300 max-w-xs">{analysisStep || 'Extracting printed text details...'}</p>
          </div>
        </div>
      )}

      {/* Bottom Controls Sheet */}
      <div className="z-20 space-y-2.5 pb-2 max-w-md mx-auto w-full">
        {errorMsg && (
          <div className="p-2.5 bg-[#FFF1F2] border border-[#EF4444]/30 rounded-xl text-xs text-[#EF4444] font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Manual Code Input or Toggle */}
        {showManualInput ? (
          <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-white/40 space-y-2 text-black">
            <label className="block text-xs font-bold text-slate-800">Enter Code or Batch Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. DS-MET-500-A"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
              />
              <button
                onClick={() => processScanCode(manualCode || 'DS-MET-500-A')}
                className="px-4 py-2 bg-[#0F766E] text-white text-xs font-bold rounded-xl"
              >
                Verify
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowManualInput(true)}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-black text-white flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#10B981]" /> Enter Code Manually
            </button>
          </div>
        )}

        {/* 1-Click Sample Strip Scanners / Presets */}
        <div className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#10B981] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Strip Image Presets
            </span>
            <span className="text-[9px] text-[#A7F3D0]/70 font-semibold">1-Click Test</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('OPX');
                analyzeStripMediaText('/demo/sample_feso4_strip.svg', 'opox_200mg_strip.jpg');
              }}
              className="p-2 bg-gradient-to-tr from-[#0F766E]/40 to-[#14B8A6]/40 hover:brightness-110 rounded-xl text-left border border-[#14B8A6]/60 transition-all active:scale-95"
            >
              <p className="text-xs font-black text-white">⭐ Opox-CV 200mg</p>
              <p className="text-[9px] text-[#2DD4BF] font-bold">SAI RAM CLINIC</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('AMP');
                analyzeStripMediaText('/demo/sample_ascorbic_strip.svg', 'amphojel_120ml_bottle.jpg');
              }}
              className="p-2 bg-gradient-to-tr from-[#1E40AF]/40 to-[#3B82F6]/40 hover:brightness-110 rounded-xl text-left border border-[#3B82F6]/60 transition-all active:scale-95"
            >
              <p className="text-xs font-black text-white">⭐ Amphojel 120ml</p>
              <p className="text-[9px] text-[#93C5FD] font-bold">DOD FORM 1289</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('FES');
                analyzeStripMediaText('/demo/sample_feso4_strip.svg', 'feso4_325mg_strip.jpg');
              }}
              className="p-2 bg-gradient-to-tr from-[#059669]/30 to-[#10B981]/30 hover:brightness-110 rounded-xl text-left border border-[#10B981]/50 transition-all active:scale-95"
            >
              <p className="text-xs font-black text-white">FeSO4 325mg</p>
              <p className="text-[9px] text-[#34D399] font-bold">Rx MATCH (IRON)</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('ASC');
                analyzeStripMediaText('/demo/sample_ascorbic_strip.svg', 'ascorbic_acid_100mg_strip.jpg');
              }}
              className="p-2 bg-gradient-to-tr from-[#D97706]/30 to-[#F59E0B]/30 hover:brightness-110 rounded-xl text-left border border-[#F59E0B]/50 transition-all active:scale-95"
            >
              <p className="text-xs font-black text-white">Ascorbic Acid 100mg</p>
              <p className="text-[9px] text-[#FBBF24] font-bold">Rx MATCH (VIT C)</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('AZI');
                analyzeStripMediaText('/demo/sample_azithromycin_strip.png', 'azithromycin_500mg_strip.jpg');
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all"
            >
              <p className="text-xs font-black text-white">Azithromycin 500mg</p>
              <p className="text-[9px] text-[#F43F5E] font-bold">MISMATCH FLOW</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('MET');
                analyzeStripMediaText('/demo/sample_metformin_strip.png', 'metformin_500mg_strip.jpg');
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all"
            >
              <p className="text-xs font-black text-white">Metformin 500mg</p>
              <p className="text-[9px] text-[#10B981] font-bold">METFORMIN STRIP</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('ATO');
                analyzeStripMediaText('/demo/sample_atorvastatin_strip.png', 'atorvastatin_10mg_strip.jpg');
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all"
            >
              <p className="text-xs font-black text-white">Atorvastatin 10mg</p>
              <p className="text-[9px] text-[#60A5FA] font-bold">VALID STRIP</p>
            </button>

            <button
              onClick={() => {
                setScanTab('MEDIA');
                handleSelectSampleStrip('PAN');
                analyzeStripMediaText('/demo/sample_pantoprazole_strip.png', 'pantoprazole_40mg_expired.jpg');
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all"
            >
              <p className="text-xs font-black text-white">Pantoprazole 40mg</p>
              <p className="text-[9px] text-[#F59E0B] font-bold">EXPIRED BATCH</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
