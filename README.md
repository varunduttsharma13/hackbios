🛡️ MED-BRIDGE
Product-Grade Digital Prescription Network & AI Medication Safety Platform
![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Google Gemini Vision](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash%20Vision-8E75C2?style=flat-square&logo=google)
![Safety Tests](https://img.shields.io/badge/Safety%20Engine%20Tests-24%2F24%20Passed-15803D?style=flat-square)
![CDSCO & ABDM](https://img.shields.io/badge/Regulatory-CDSCO%20%2F%20ABDM%20Ready-0F766E?style=flat-square)
> **“Sahi Dawai • Sahi Dose • Surakshit Zindagi”**  
> An industry-grade, human-centered digital healthcare platform connecting Doctors, Patients, and Pharmacists into a unified, cryptographically verifiable prescription and medication safety pipeline.
---
🧭 Table of Contents
The Clinical Problem & Mission
End-to-End Healthcare Workflow
Dedicated Workspace Portals
Health Records Management Hub
Medicine & Common Conditions Health Guide
About, Privacy & Regulatory Support
Color Architecture & Design Token System
Motion Design & Microinteraction System
Deterministic 6-Point Medication Safety Engine
Gemini Vision OCR & Multimodal Ingestion
Inclusive Accessibility Gateway (Feature Phone SMS)
Codebase Architecture & File Structure
Quickstart, Automated Testing & Verification
Pre-Configured Demo Scenarios
Regulatory Standards & Cryptographic Audit
---
🩺 The Clinical Problem & Mission
Every day across India and global healthcare systems:
Over 50% of prescription errors stem from illegible handwriting, transcription typos, or look-alike/sound-alike (LASA) drug confusion.
Patients and caregivers hand crumpled paper slips across retail pharmacy counters with zero real-time verification of whether the dispensed blister strip matches the prescribed molecule, strength, or active salt.
Recalled, spurious, or expired medication batches slip through distribution chains into home medicine boxes, posing severe, life-threatening risks to vulnerable patients and the elderly.
MED-BRIDGE acts as an intelligent safety shield between the prescriber’s pen and the patient’s pillbox. It replaces ambiguous paper slips with a deterministic clinical network where every prescription is digitally signed, transparently shared, and mechanically cross-verified against the physical blister strip packaging prior to dispensing.
---
🔄 End-to-End Healthcare Workflow
```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. DOCTOR WORKSPACE                             │
│   • Structured clinical editor with dosage, route & duration           │
│   • Gemini Vision OCR ingestion of physical handwritten notes          │
│   • Digital signature & persistent Reference ID (e.g., DS-10452)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                        [ FINALIZE & DISPATCH ]
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   2. INCLUSIVE ACCESSIBILITY GATEWAY                   │
│   • SMS Reference dispatched to patient (+91 98765 43210)              │
│   • 100% accessible on basic keypad feature phones (no app required)   │
│   • Prepared for ABDM / ABHA Health Locker Synchronization             │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌───────────────────────────────┐  ┌─────────────────────────────────────┐
│      3. PATIENT PORTAL        │  │       4. PHARMACIST WORKSPACE       │
│ • Clear medication schedules  │  │ • Authorised lookup (Ref / Phone)   │
│ • Health records hub (PDF/XLS)│  │ • Optical blister strip scanner     │
│ • Health guide & monographs   │  │ • Batch & expiry validation         │
│ • Verifiable QR & PDF export  │  │ • Live dispensing execution         │
└───────────────────────────────┘  └──────────────────┬──────────────────┘
                                                     │
                                           [ 6-POINT COMPARISON ]
                                                     │
                                                     ▼
                                   ┌─────────────────────────────────────┐
                                   │     5. DETERMINISTIC SAFETY CHECK   │
                                   │ • Molecule & Generic Salt Match     │
                                   │ • Strength & Unit Normalization     │
                                   │ • Frequency & Dosage Route Check    │
                                   │ • CDSCO Recall & Expired Check      │
                                   │ • Drug-Drug Interaction Screen      │
                                   │ ➔ Outcome: MATCH / MISMATCH / ALERT │
                                   └─────────────────┬───────────────────┘
                                                     │
                                           [ DISPENSING APPROVAL ]
                                                     │
                                                     ▼
                                   ┌─────────────────────────────────────┐
                                   │    6. REGULATORY AUDIT & LOGS       │
                                   │ • Status: DISPENSED & LOCKED        │
                                   │ • Cryptographic audit timestamp     │
                                   │ • Pharmacovigilance (PvPI) Logging  │
                                   └─────────────────────────────────────┘
```
---
🏢 Dedicated Workspace Portals
Each portal is built with purposeful visual hierarchy, information density, and functional ergonomics tailored to its clinical role:
1. Doctor Workspace (`/doctor`)
Color Accent: Clinical Blue (`#2458A6`) & Surface (`#EEF4FC`)
Core Route: `app/doctor/page.tsx`
Clinical Prescription Builder: `app/doctor/prescriptions/new/page.tsx`
Patient Directory: `app/doctor/patients/page.tsx`
Capabilities: Multi-drug dosage rows (Name, Strength, Form, Frequency, Duration, Directions), live contraindication warnings, Gemini Vision handwritten OCR parser, and one-tap cryptographic digital signing.
2. Patient Experience (`/patient`)
Color Accent: Natural Green (`#217A56`) & Light Mint (`#EEF7F0`)
Core Route: `app/patient/page.tsx`
Prescriptions Directory: `app/patient/prescriptions/page.tsx`
Prescription Details & PDF: `app/patient/prescriptions/[id]/page.tsx`
Capabilities: Calm daily intake schedule (morning, afternoon, evening, bedtime), plain-language dosage instructions, offline-ready verifiable QR token, authorized clinical PDF export, and family profile switching.
3. Pharmacist Station (`/pharmacy`)
Color Accent: Deep Teal (`#087E80`) & Soft Aqua (`#E9F6F5`)
Core Route: `app/pharmacy/page.tsx`
Prescription Lookup: `app/pharmacy/prescriptions/page.tsx`
Verification & Comparator: `app/pharmacy/verify/page.tsx`
Capabilities: Rapid reference lookup by unique ID (`DS-XXXXX`), telephone number, or QR scan; seamless handoff to scan physical medication blister packs; deterministic match vs mismatch assessment; tamper-proof dispensing execution with real-time audit logging.
4. Professional Optical Scanner (`/medicine/scan`, `/prescription/capture`)
Color Accent: Graphite Canvas (`#0B0F17`) & Restrained Turquoise (`#14B8A6`)
Core Route: `app/medicine/scan/page.tsx`
Capabilities: Dedicated high-contrast viewfinder with laser alignment reticles, zoom controls (`1x`, `2x`, `3x`), torch toggle, camera snapshot and photo upload fallbacks, real-time packaging text extraction, and packaging OCR confidence telemetry.
5. Administrator & Telemetry Center (`/admin`)
Color Accent: Slate Surface (`#0F172A`) & Restrained Violet (`#5250A8`)
Core Route: `app/admin/page.tsx`
Capabilities: Real-time CDSCO and Central Drug Registry telemetry sync indicators, database health monitoring, 7-day scan volumes, verification outcome breakdown, AI OCR confidence score distribution, and trusted national medicine registry CRUD.
---
📁 Health Records Management Hub
Routes: `/records` and `/patient/health-records`
A complete, zero-data-loss personal health record (PHR) management system designed for patients and caregivers:
13 Structured Record Categories:
Prescriptions, Lab Reports, Discharge Summaries, Vaccination Records, Imaging & Scans (X-Ray/MRI/CT), Consultation Notes, Surgical History, Pathology, Allergy Cards, Chronic Care Trackers, Dental Records, Teleconsultation Logs, and Other.
Smart Data Ingestion (Import):
CSV / TSV: Multi-row bulk import with header auto-mapping.
Excel (.xlsx): Structured spreadsheet parsing via `xlsx`.
JSON: Complete data interchange format for interoperability.
Automatic Validation & Duplicate Detection: Pre-screens records by date, title, and provider to prevent redundant entries before confirmation.
Document Attachment Management:
Direct upload for medical PDFs and images (PNG, JPEG, WebP) with client-side mime-type and file-size guardrails.
In-browser document preview drawer with download options.
Multi-Format Export & Sharing:
PDF Clinical Summary: Clean, printable medical document generated in-browser via `jspdf`.
Excel (.xlsx) & CSV: UTF-8 BOM formatted data export.
JSON: Complete backup download.
Print-Friendly View: CSS print media styling for physical clinical handovers.
Organization & Views: Instant full-text search, category chip filtering, chronological timeline view, and detailed inspection drawer.
---
🌿 Medicine & Common Conditions Health Guide
Routes: `/health-guide`, `/patient/health-guide`, `/health-guide/medicines`, and `/patient/medicines`
A comprehensive, evidence-based clinical education library empowering patients while upholding strict medical safety guardrails:
12 Common Symptom & Condition Categories:
Fever (High Body Temperature)
Cold, Runny Nose & Sinus Congestion
Cough, Bronchial Irritation & Sore Throat
Allergies, Urticaria & Hay Fever
Headache, Tension & Migraine
Acidity, Heartburn & Indigestion
Constipation, Acute Loose Motions & Dehydration
Skin Rashes, Fungal Infections & Minor Burns
Oral Health, Aphthous Ulcers & Toothache
Eye Irritation & Ear Congestion
General Wellness, Fatigue & Multivitamins
Child Health & Pediatric Precautions
Condition Detail Architecture (`/health-guide/conditions/[id]`):
Clinical overview and pathophysiological context.
Typical symptom presentation and self-monitoring guidance.
Non-pharmacological supportive self-care (hydration, rest, steam).
Common therapeutic classes (e.g., Antipyretics, Antihistamines, Antacids).
Important safety precautions and contraindications.
When to consult a medical professional.
High-Priority Red-Flag Emergency Signs: Direct reference to emergency medical services (112 / 108).
Comprehensive Medicine Directory (`/health-guide/medicines`):
Searchable monographs by brand name or generic chemical salt.
Therapeutic classification and regulatory status (OTC vs Schedule H Prescription).
Standard adult dosage forms, typical indications, and side-effect profiles.
Direct deep-links into the Drug-Drug Interaction Checker (`/interactions`).
Strict Medical Safety Guardrails:
Explicit non-prescriptive disclaimers: General health literacy only.
Zero automated prescribing based on selected symptoms.
Zero automated pediatric dose calculations to prevent accidental toxic overdoses in infants and children.
---
ℹ️ About, Privacy & Regulatory Support
Route: `/about`
Mission & Architecture: Explains the core philosophy of MED-BRIDGE and how it eliminates prescription misinterpretation and spurious drug dispensing.
ABDM & Data Protection Principles:
Patient data sovereignty: Zero unauthorized commercialization of health data.
Client-side data storage with zero unconsented telemetry tracking.
Cryptographic digital hashes for tamper detection.
National Helplines Directory:
National Emergency Number: 112
National Ambulance Service: 108
National Pharmacovigilance Programme of India (PvPI - Toll-Free): 1800-180-3024
Tele-MANAS Mental Health Support: 14416
---
🎨 Color Architecture & Design Token System
MED-BRIDGE enforces an intentional, accessible design token system defined in `app/globals.css` that strictly separates brand and role visual identities from safety status semantics:
```css
:root {
  /* Global Brand Identity */
  --brand-forest: #124A43;
  --brand-teal: #0F766E;
  --brand-mint: #EAF5F0;
  --neutral-bg: #F7F8F6;
  --text-primary: #182522;
  --text-secondary: #65716D;
  --border-subtle: #E4E9E5;

  /* Doctor Workspace: Clinical Precision */
  --doctor-primary: #2458A6;
  --doctor-surface: #EEF4FC;
  --doctor-accent: #6B8FC9;

  /* Patient Portal: Natural & Approachable */
  --patient-primary: #217A56;
  --patient-surface: #EEF7F0;
  --patient-accent: #9BC9A8;

  /* Pharmacist Station: Operational Efficiency */
  --pharmacy-primary: #087E80;
  --pharmacy-surface: #E9F6F5;
  --pharmacy-accent: #54B7B0;

  /* Scanner Utility: High Contrast Graphite */
  --scanner-bg: #0B0F17;
  --scanner-reticle: #14B8A6;

  /* Administrator Center: Data & Telemetry */
  --admin-primary: #5250A8;
  --admin-surface: #F0F0FA;

  /* Semantic Safety Statuses (Universal Across All Workspaces) */
  --status-match: #15803D;
  --status-match-bg: #F0FDF4;
  --status-mismatch: #B42318;
  --status-mismatch-bg: #FEF2F2;
  --status-warning: #B45309;
  --status-warning-bg: #FFFBEB;
  --status-info: #2563EB;
  --status-info-bg: #EFF6FF;
}
```
---
✨ Motion Design & Microinteraction System
Built with performance and accessibility in mind, MED-BRIDGE implements a 3-tier motion architecture defined in `lib/motion.ts`:
Tier	Duration Range	Target Elements	Purpose
Microinteractions	100–160ms	Buttons, chips, switches, inputs	Instant, crisp feedback on touch/click
Interface Transitions	200–240ms	Drawers, dialogs, sheet overlays, tabs	Smooth, controlled spatial continuity
Workflow Feedback	240–300ms	OCR progress, verification results, scans	Informative progression without blocking UI
Accessible Toast Primitives: `components/ui/Toast.tsx` provides animated, self-dismissing semantic notifications (`success`, `error`, `warning`, `info`) with screen reader `role="alert"` announcements.
Loading State Skeletons: `components/ui/Skeleton.tsx` eliminates jarring layout shifts during data loading.
Reduced Motion Compliance: Automatically adheres to `prefers-reduced-motion: reduce` media queries.
---
⚙️ Deterministic 6-Point Medication Safety Engine
The safety engine (`lib/safety/engine.ts`) evaluates every verification through six deterministic clinical rules without relying on unvalidated probabilistic outputs:
#	Clinical Verification Point	Check Description	Failure Outcome
1	Active Salt & Molecule Match	Cross-references generic molecule identity (e.g., Metformin Hydrochloride vs Azithromycin) and guards against empty string matches.	CRITICAL MISMATCH
2	Strength & Dosage Unit Normalization	Validates unit equivalence (e.g., `500 mg` vs `1000 mg`, `0.5 g` normalized to `500 mg`). Rejects missing or uncertain strength.	DOSAGE MISMATCH
3	Dosage Form & Route	Checks pharmaceutical form compatibility (Tablet, Capsule, Oral Suspension, Injection).	FORM MISMATCH
4	Manufacturer Shelf-Life & Expiry	Verifies current calendar date against packaging manufacturer expiry imprint.	EXPIRED STRIP
5	CDSCO Batch Recall Registry	Matches scanned batch number against national regulatory alerts and spurious drug notices. Alerts are isolated to recalled batches only.	BATCH RECALL ALERT
6	Drug-Drug Contraindications	Screens prescribed medications against concurrent therapies and patient chronic conditions.	INTERACTION WARNING
Automated Test Suite
The engine is rigorously validated against 24 distinct clinical scenarios in `scripts/test-safety-engine.ts`, covering exact matches, aliases, mismatched molecules, mismatched strengths, expired batches, CDSCO recalls, interactions, and whitespace edge cases.
To execute the test suite:
```bash
npx tsx scripts/test-safety-engine.ts
```
Result: 24/24 tests passed (100% success rate).
---
👁️ Gemini Vision OCR & Multimodal Ingestion
Multimodal Pipeline: Prescriptions and packaging blister strips are parsed using Google Gemini 1.5 Flash Vision (`lib/ai/gemini.ts`).
Extracted Metadata:
Active generic molecule & brand trade name
Strength and concentration
Manufacturer license name
Commercial batch number
Manufacturing & expiration dates
OCR extraction confidence metric ($0-100%$)
Offline / Sandbox Resilience: In sandbox or offline mode (`MOCK_AI_MODE=true`), the system seamlessly switches to pre-verified clinical test fixtures without failing or halting execution.
---
📱 Inclusive Accessibility Gateway (Feature Phone SMS)
A fundamental barrier in digital health is requiring smartphones, internet connections, and English literacy. MED-BRIDGE solves this at the core architecture level:
Zero Smartphone Requirement for Patients: When the doctor finalizes an e-prescription, an SMS is dispatched over standard telecommunication routes (simulated in demo mode):
```text
   MED-BRIDGE: Dr. Arvind Sharma has prescribed 2 medicines. 
   Ref Code: DS-10452. Show this code or phone number to any registered chemist. 
   Helpline: 1800-DAWAI-SAFE
   ```
Chemist Retrieval: The pharmacist enters `DS-10452` or the patient's phone number into `/pharmacy/prescriptions` to pull the full clinical document.
ABDM / ABHA Alignment: Designed to integrate with Ayushman Bharat Digital Mission (ABDM) M1/M2/M3 milestone APIs.
---
📂 Codebase Architecture & File Structure
```
hackbios/
├── app/
│   ├── globals.css                       # Semantic CSS design token architecture
│   ├── layout.tsx                        # Root layout & PWA viewport configuration
│   ├── page.tsx                          # Root landing & system overview
│   ├── onboarding/page.tsx               # Product onboarding & role selection
│   ├── login/page.tsx                    # Multi-role authentication & switchboard
│   ├── dashboard/page.tsx                # Universal command hub & scenario launcher
│   ├── doctor/
│   │   ├── page.tsx                      # Clinical blue doctor dashboard
│   │   ├── patients/page.tsx             # Patient directory & clinical tags
│   │   ├── prescriptions/
│   │   │   ├── new/page.tsx              # e-Prescription structured builder
│   │   │   └── [id]/page.tsx             # Clinical document viewer & print preview
│   ├── patient/
│   │   ├── page.tsx                      # Calm natural-green patient portal
│   │   ├── health-records/page.tsx       # Mirrored patient health records hub
│   │   ├── medicines/page.tsx            # Mirrored patient medicine directory
│   │   ├── health-guide/page.tsx         # Mirrored patient common conditions guide
│   │   └── prescriptions/
│   │       ├── page.tsx                  # Active & past prescription directory
│   │       └── [id]/page.tsx             # Digital prescription with QR & PDF export
│   ├── pharmacy/
│   │   ├── page.tsx                      # Deep-teal operational pharmacy station
│   │   ├── prescriptions/page.tsx        # Prescription retrieval (Ref / QR / Phone)
│   │   └── verify/page.tsx               # Physical blister strip scan comparator
│   ├── records/page.tsx                  # Health Records hub (13 categories, Import/Export)
│   ├── health-guide/
│   │   ├── page.tsx                      # 12 Common Conditions directory & emergency guide
│   │   ├── conditions/[id]/page.tsx      # Comprehensive condition detail & care plan
│   │   └── medicines/
│   │       ├── page.tsx                  # Filterable medicine monographs & OTC/Schedule H
│   │       └── [id]/page.tsx             # Pharmacology monograph detail & interactions
│   ├── about/page.tsx                    # Product mission, ABDM privacy, helplines & architecture
│   ├── prescription/
│   │   ├── capture/page.tsx              # Camera viewfinder for doctor prescription
│   │   ├── confirm/page.tsx              # Transcription review & dosage editor
│   │   └── results/page.tsx              # OCR breakdown & extracted entities
│   ├── medicine/
│   │   ├── scan/page.tsx                 # Graphite optical scanner for blister foil
│   │   ├── verify/page.tsx               # Foil certificate & packaging badge
│   │   └── [id]/page.tsx                 # Pharmacology monograph & interactions
│   ├── match/page.tsx                    # Authoritative 6-point side-by-side comparator
│   ├── safety/page.tsx                   # Verifiable clinical safety certificate
│   ├── admin/page.tsx                    # Telemetry, registry CRUD & recall issuer
│   ├── history/page.tsx                  # Chronological audit log of all verifications
│   ├── alerts/page.tsx                   # CDSCO regulatory drug safety bulletins
│   ├── interactions/page.tsx             # Live drug-drug contraindication engine
│   └── api/                              # REST API endpoints for all workflows
│       ├── prescriptions/route.ts        # Digital prescriptions CRUD & search
│       ├── prescriptions/[id]/route.ts   # Prescription lookup, status updates & cancel
│       ├── prescriptions/[id]/dispense/  # Dispensing execution & duplicate lock
│       ├── records/route.ts              # Health records archive, import & export
│       ├── patients/route.ts             # Patient directory & ABHA status
│       ├── audit/route.ts                # Immutable regulatory audit trail
│       ├── medicines/route.ts            # National medicine packaging catalog
│       ├── alerts/route.ts               # CDSCO batch recall & safety bulletins
│       ├── history/route.ts              # Historical verification logs
│       ├── match/route.ts                # Deterministic 6-point comparison
│       ├── medicine/scan/route.ts        # Blister strip OCR & packaging parser
│       └── safety/check/route.ts         # Clinical contraindication screener
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx                  # Responsive layout shell with Toast notifications
│   │   ├── Navbar.tsx                    # Clean header with brand mark & role switcher
│   │   ├── BottomNav.tsx                 # Role-adaptive mobile thumb navigation
│   │   └── Sidebar.tsx                   # Desktop navigation & compliance footer
│   └── ui/
│       ├── Toast.tsx                     # Semantic status toasts (Success, Error, Warning, Info)
│       ├── Skeleton.tsx                  # Accessible skeleton loading placeholders
│       ├── WorkflowProgress.tsx          # 4-stage verification progress stepper
│       └── ResponsiveSheet.tsx           # Accessible modal & bottom sheet drawer
├── lib/
│   ├── ai/gemini.ts                      # Google Gemini Vision OCR integration
│   ├── safety/engine.ts                  # Deterministic 6-point clinical safety engine
│   ├── motion.ts                         # 3-tier motion curves, durations & variants
│   ├── records/importExport.ts           # CSV, XLSX, JSON, PDF & print export engines
│   ├── mock/demoData.ts                  # Realistic clinical fixtures & CDSCO recalls
│   └── context/VerificationContext.tsx   # Cross-role verification state management
├── scripts/
│   ├── test-safety-engine.ts             # 24-scenario automated test suite for safety engine
│   └── test-backend-api.ts               # 15-scenario end-to-end backend integration test suite
└── types/
    ├── verification.ts                   # Strict clinical prescription & verification types
    └── healthRecords.ts                  # Strict health records data contracts
```
---
🚀 Quickstart, Automated Testing & Verification
1. Prerequisites
Node.js: v18.18+ or v20+ recommended
Package Manager: `npm` or `pnpm`
2. Installation & Running
```bash
# 1. Clone repository & enter workspace
git clone <repo-url>
cd hackbios

# 2. Install dependencies
npm install

# 3. Start local Next.js development server
npm run dev
```
Open http://localhost:3000 in your browser. The application runs immediately with full offline demo datasets and offline safety verification enabled.
3. Automated Testing & Verification Commands
```bash
# Run the 15-scenario end-to-end backend API integration test suite
npx tsx scripts/test-backend-api.ts

# Run the 24-scenario deterministic safety engine test suite
npx tsx scripts/test-safety-engine.ts

# Run strict TypeScript type-checking across the entire codebase
npx tsc --noEmit

# Compile the production Next.js build
npm run build

# Start the compiled production server
npm start
```
---
🧪 Pre-Configured Demo Scenarios
Test the end-to-end clinical workflow directly via the Role Switchboard (`/login`) or the Dashboard Quick Demo:
Scenario	Prescribed Drug	Dispensed / Scanned Foil	Expected Result	Safety Engine Action
1. Genuine Safe Match	Ferrous Sulfate 325 mg	Ferrous Sulfate 325 mg (Batch: `FSO-325A`)	🟢 MATCH	Verification certificate generated; safe for dispensing.
2. Dangerous Dispensing Mismatch	Metformin 500 mg	Azithromycin 500 mg (Batch: `AZI-500D`)	🔴 MISMATCH	Dispensing blocked. High-contrast alert flags wrong molecule.
3. Expired Pharmaceutical Strip	Pantoprazole 40 mg	Pantoprazole 40 mg (Expiry: `Jan 2024`)	🟡 EXPIRED	Flagged as expired. Pharmacist prompted to quarantine stock.
4. CDSCO National Batch Recall	Paracetamol 500 mg	Paracetamol 500 mg (Batch: `PAR500REC`)	🚨 RECALL	Active regulatory bulletin triggered; PvPI helpline displayed.
5. Dosage Strength Mismatch	Amoxicillin 500 mg	Amoxicillin 250 mg	🔴 MISMATCH	Flagged as incorrect strength; dosage under-dosing risk alerted.
6. Drug-Drug Contraindication	Metformin 500 mg	Sildenafil (Concurrent)	⚠️ WARNING	Flagged in contraindication screen; clinical review requested.
---
⚖️ Regulatory Standards & Cryptographic Audit
Central Drugs Standard Control Organisation (CDSCO): Rule matching adheres to Good Pharmacy Practice (GPP) and Schedule H prescription drug dispensing rules.
National Pharmacovigilance Programme of India (PvPI): Built-in adverse reaction reporting mechanism with direct toll-free helpline reference (`1800-180-3024`).
Tamper-Resistant Audit Trail: Every verification logs patient identifier, prescriber license number, dispensing pharmacist registry, batch code, match verdict, and timestamp into an immutable audit history viewable in `/history` and `/admin`.
---
<div align="center">
  <sub>Built with clinical precision, human empathy, and code for medication safety in India and beyond. 🩺🌿</sub>
</div>
