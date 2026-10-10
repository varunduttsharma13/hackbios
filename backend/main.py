"""FastAPI service for MED-BRIDGE's medicine-verification workflow.

The service intentionally returns the same {success, data} response envelopes as
the original Next.js API routes, so the web client can switch backends without
changing its view models.  It uses in-memory demo data; replace the repository
functions with Supabase queries when deploying persistent data.
"""

from __future__ import annotations

import os
import re
from datetime import datetime, timezone
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


def now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


MEDICINES: list[dict[str, Any]] = [
    {"id": "med_met_500", "medicine_name": "Metformin 500 mg", "generic_name": "Metformin Hydrochloride", "strength": "500 mg", "manufacturer": "Sun Pharma Ltd.", "batch_number": "MET500A", "manufacture_date": "Aug 2024", "expiry_date": "Aug 2026", "qr_code": "DS-MET-500-A", "barcode": "8901234567890", "verification_status": "VERIFIED", "form": "Tablet (Oral)", "prescription_required": True},
    {"id": "med_azi_500", "medicine_name": "Azithromycin 500 mg", "generic_name": "Azithromycin Dihydrate", "strength": "500 mg", "manufacturer": "Demo Pharma Ltd.", "batch_number": "AZ15001", "manufacture_date": "Jan 2025", "expiry_date": "Dec 2027", "qr_code": "DS-AZI-500-A", "barcode": "8909876543210", "verification_status": "VERIFIED", "form": "Tablet", "prescription_required": True},
    {"id": "med_ato_10", "medicine_name": "Atorvastatin 10 mg", "generic_name": "Atorvastatin Calcium", "strength": "10 mg", "manufacturer": "Cipla Ltd.", "batch_number": "ATOR10B", "manufacture_date": "Nov 2024", "expiry_date": "Nov 2026", "qr_code": "DS-ATO-10-B", "barcode": "8904567890123", "verification_status": "VERIFIED", "form": "Film-coated Tablet", "prescription_required": True},
    {"id": "med_pan_40", "medicine_name": "Pantoprazole 40 mg", "generic_name": "Pantoprazole Sodium", "strength": "40 mg", "manufacturer": "Zydus Healthcare", "batch_number": "PAN40EX", "manufacture_date": "Jul 2023", "expiry_date": "Jul 2025", "qr_code": "DS-PAN-40-E", "barcode": "8903456789012", "verification_status": "EXPIRED", "form": "Gastro-resistant Tablet", "prescription_required": True},
    {"id": "med_par_500", "medicine_name": "Paracetamol 500 mg", "generic_name": "Acetaminophen", "strength": "500 mg", "manufacturer": "Apex Labs", "batch_number": "PAR500REC", "manufacture_date": "May 2024", "expiry_date": "May 2026", "qr_code": "DS-PAR-500-R", "barcode": "8902345678901", "verification_status": "ALERT", "form": "Tablet", "prescription_required": False},
]

ALERTS: list[dict[str, Any]] = [
    {"id": "alert_1", "title": "Ranitidine Tablets Recalled", "description": "Manufacturing defect and impurity concerns reported by CDSCO. Stop usage immediately.", "medicine_name": "Ranitidine 150 mg", "batch_number": "RAN150X", "severity": "CRITICAL", "source": "CDSCO Health Advisory", "date": "18 Aug 2026", "active": True},
    {"id": "alert_2", "title": "Paracetamol Batch Recall - PAR500REC", "description": "Voluntary recall by Apex Labs for batch PAR500REC due to packaging seal inconsistency.", "medicine_name": "Paracetamol 500 mg", "batch_number": "PAR500REC", "severity": "WARNING", "source": "Manufacturer Direct Alert", "date": "10 Aug 2026", "active": True},
]
INTERACTIONS = [
    {"medicine_a": "Metformin", "medicine_b": "NSAIDs (Ibuprofen / Naproxen)", "description": "May increase risk of kidney-function impairment or lactic acidosis.", "recommendation": "Consult your doctor before combining these medicines."},
    {"medicine_a": "Atorvastatin", "medicine_b": "Clarithromycin", "description": "May increase atorvastatin concentration and muscle-breakdown risk.", "recommendation": "A clinician should review this combination."},
]
HISTORY: list[dict[str, Any]] = []
USER = {"id": "usr_demo_101", "name": "Aarav Sharma", "phone": "+91 9999999999", "email": "aarav.sharma@example.com", "created_at": "2026-01-15T09:00:00Z", "family_members": [{"id": "f_self", "name": "Aarav (Self)", "relation": "Self"}], "role": "user"}


class PrescriptionAnalyzeRequest(BaseModel):
    imageBase64: str = ""
    preset: Literal["metformin_atorvastatin", "azithromycin_only", "custom"] = "metformin_atorvastatin"


class ScanRequest(BaseModel):
    code: str = ""
    scanType: Literal["QR", "BARCODE", "MANUAL", "MEDIA_UPLOAD", "PHOTO"] = "QR"
    imageBase64: str = ""
    fileName: str = ""
    hintText: str = ""


class ConfirmRequest(BaseModel):
    medicines: list[dict[str, Any]]


class MatchRequest(BaseModel):
    prescribed: dict[str, Any]
    stripItem: dict[str, Any]


class AlertRequest(BaseModel):
    title: str
    description: str
    medicine_name: str
    batch_number: str = ""
    severity: Literal["CRITICAL", "WARNING", "INFO"] = "WARNING"
    source: str = "Admin Direct Entry"


class SafetyCheckRequest(BaseModel):
    medicineName: str = ""
    strength: str = ""
    batchNumber: str = ""
    expiryDate: str = ""


app = FastAPI(title="MED-BRIDGE API", version="1.0.0", description="Medicine strip and prescription safety verification API")
origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",") if origin.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower().strip())


def find_medicine(code: str) -> dict[str, Any] | None:
    needle = code.strip().upper()
    for medicine in MEDICINES:
        if needle in {medicine["qr_code"].upper(), medicine["barcode"].upper(), medicine["batch_number"].upper()}:
            return medicine
    fuzzy = {"MET": "Metformin", "AZI": "Azithromycin", "ATO": "Atorvastatin", "PAN": "Pantoprazole", "PAR": "Paracetamol"}
    for token, name in fuzzy.items():
        if token in needle:
            return next(item for item in MEDICINES if name in item["medicine_name"])
    return None


def expiry_status(expiry: str) -> str:
    try:
        date = datetime.strptime(expiry, "%b %Y")
        if date.year < datetime.now().year:
            return "EXPIRED"
        if date.year == datetime.now().year:
            return "NEAR_EXPIRY"
    except ValueError:
        pass
    return "VALID"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "med-bridge-api"}


@app.get("/api/profile")
def profile() -> dict[str, Any]:
    return {"success": True, "data": USER}


@app.get("/api/medicines")
def medicines() -> dict[str, Any]:
    return {"success": True, "data": MEDICINES}


@app.get("/api/medicines/{medicine_id}")
def medicine_by_id(medicine_id: str) -> dict[str, Any]:
    medicine = next((item for item in MEDICINES if item["id"] == medicine_id), None)
    if not medicine:
        raise HTTPException(404, "Medicine not found")
    return {"success": True, "data": medicine}


@app.post("/api/prescription/analyze")
def analyze_prescription(request: PrescriptionAnalyzeRequest) -> dict[str, Any]:
    medicines = [{"id": f"em_demo_{int(datetime.now().timestamp())}_1", "medicine_name": "Metformin", "strength": "500 mg", "frequency": "Twice daily", "duration": "1 month", "confidence_score": 96, "confidence_level": "HIGH", "user_confirmed": True}]
    doctor, date = "Dr. R. K. Sharma", "2026-08-12"
    if request.preset == "metformin_atorvastatin":
        medicines.append({"id": f"em_demo_{int(datetime.now().timestamp())}_2", "medicine_name": "Atorvastatin", "strength": "10 mg", "frequency": "Once daily", "duration": "1 month", "confidence_score": 72, "confidence_level": "MEDIUM", "user_confirmed": False, "notes": "Needs confirmation of dose & frequency"})
    elif request.preset == "azithromycin_only":
        medicines[0].update({"medicine_name": "Azithromycin", "frequency": "Once daily", "duration": "3 days"})
        doctor, date = "Dr. S. Mehta, MD", "2026-08-14"
    return {"success": True, "data": {"doctorName": doctor, "prescriptionDate": date, "extractedMedicines": medicines}, "ai_model": "MED-BRIDGE Vision AI Engine (Demo Mode)"}


@app.post("/api/prescription/confirm")
def confirm_prescription(request: ConfirmRequest) -> dict[str, Any]:
    confirmed = [{**medicine, "user_confirmed": True, "confirmed_at": now()} for medicine in request.medicines]
    return {"success": True, "message": "Prescription details confirmed by user.", "data": confirmed}


@app.post("/api/medicine/scan")
def scan_medicine(request: ScanRequest) -> dict[str, Any]:
    if request.imageBase64 or request.scanType in {"MEDIA_UPLOAD", "PHOTO"}:
        hint = f"{request.fileName} {request.hintText} {request.code}".lower()
        if "azi" in hint:
            med = MEDICINES[1]
            raw_text = f"AZITHROMYCIN 500mg • B.No. {med['batch_number']} • EXP. {med['expiry_date']} • MFG: {med['manufacturer']}"
        elif "ato" in hint:
            med = MEDICINES[2]
            raw_text = f"ATORVASTATIN 10mg Film-Coated • B.No. {med['batch_number']} • EXP. {med['expiry_date']} • CIPLA"
        elif "pan" in hint:
            med = MEDICINES[3]
            raw_text = f"PANTOPRAZOLE 40mg Gastro-Resistant • B.No. {med['batch_number']} • EXP. {med['expiry_date']} (EXPIRED)"
        elif "par" in hint:
            med = MEDICINES[4]
            raw_text = f"PARACETAMOL 500mg • B.No. {med['batch_number']} • WARNING: CDSCO RECALL ADVISORY"
        else:
            med = MEDICINES[0]
            raw_text = f"METFORMIN HYDROCHLORIDE 500mg • B.No. {med['batch_number']} • MFG. {med['manufacture_date']} • EXP. {med['expiry_date']} • SUN PHARMA"

        return {
            "success": True,
            "data": {**med, "detected_raw_text": raw_text, "confidence_score": 95},
            "scan_info": {
                "raw_code": med["qr_code"],
                "scan_type": "MEDIA_UPLOAD",
                "detected_text": raw_text,
                "confidence": 95,
                "timestamp": now(),
            },
        }

    medicine = find_medicine(request.code)
    if not medicine:
        raise HTTPException(404, detail={"success": False, "error": "Product code not found in trusted/demo medicine registry.", "raw_code": request.code})
    return {"success": True, "data": medicine, "scan_info": {"raw_code": request.code, "scan_type": request.scanType, "timestamp": now()}}


@app.post("/api/medicine/verify")
def verify_medicine(request: ScanRequest) -> dict[str, Any]:
    medicine = find_medicine(request.code)
    if not medicine:
        raise HTTPException(404, "Medicine not found")
    keys = ("medicine_name", "batch_number", "manufacturer", "manufacture_date", "expiry_date", "verification_status")
    data = {"medicine" if key == "medicine_name" else "batch" if key == "batch_number" else key: medicine[key] for key in keys}
    data["disclaimer"] = "Verified against trusted/demo registry for demonstration purposes."
    return {"success": True, "data": data}


@app.get("/api/alerts")
def list_alerts() -> dict[str, Any]:
    return {"success": True, "data": [item for item in ALERTS if item["active"]]}


@app.post("/api/alerts")
def create_alert(request: AlertRequest) -> dict[str, Any]:
    alert = {"id": f"alert_{int(datetime.now().timestamp() * 1000)}", **request.model_dump(), "date": datetime.now().strftime("%d %b %Y"), "active": True}
    ALERTS.insert(0, alert)
    return {"success": True, "data": alert}


@app.get("/api/history")
def history() -> dict[str, Any]:
    return {"success": True, "data": HISTORY}


@app.post("/api/safety/check")
def safety_check(request: SafetyCheckRequest) -> dict[str, Any]:
    recalled = next((alert for alert in ALERTS if alert["active"] and (alert.get("batch_number") == request.batchNumber or normalize(alert["medicine_name"]) in normalize(request.medicineName))), None)
    interaction = next((item for item in INTERACTIONS if normalize(item["medicine_a"]) in normalize(request.medicineName)), None)
    return {"success": True, "data": {"expiryStatus": expiry_status(request.expiryDate) if request.expiryDate else "VALID", "recallStatus": "ACTIVE_ALERT" if recalled else "NO_ALERTS", "recallDetails": recalled["description"] if recalled else None, "interactionStatus": "POTENTIAL_INTERACTION" if interaction else "SAFE", "interactionDetails": interaction["description"] if interaction else None}}


@app.post("/api/match")
def match(request: MatchRequest) -> dict[str, Any]:
    prescribed, strip = request.prescribed, request.stripItem
    medicine_match = normalize(str(prescribed.get("medicine_name", ""))) in normalize(str(strip.get("medicine_name", ""))) or normalize(str(strip.get("medicine_name", ""))) in normalize(str(prescribed.get("medicine_name", "")))
    strength_match = "".join(re.findall(r"\d+", str(prescribed.get("strength", "")))) == "".join(re.findall(r"\d+", str(strip.get("strength", ""))))
    expiry = "EXPIRED" if strip.get("verification_status") == "EXPIRED" else expiry_status(str(strip.get("expiry_date", "")))
    recalled = strip.get("verification_status") == "ALERT" or any(alert.get("batch_number") == strip.get("batch_number") for alert in ALERTS)
    match_status = "MATCHED" if medicine_match and strength_match else "PARTIAL_MATCH" if medicine_match else "MISMATCH"
    status = "MATCHED" if match_status == "MATCHED" else "MISMATCH" if match_status == "MISMATCH" else "REVIEW_REQUIRED"
    record = {"id": f"DS-{datetime.now().year}-{int(datetime.now().timestamp() * 1000) % 1000000:06d}", "user_id": "usr_demo_101", "prescribed_medicine_name": prescribed.get("medicine_name"), "prescribed_strength": prescribed.get("strength"), "prescribed_frequency": prescribed.get("frequency", "Once daily"), "scanned_medicine_name": strip.get("medicine_name"), "scanned_strength": strip.get("strength"), "scanned_batch": strip.get("batch_number"), "scanned_manufacturer": strip.get("manufacturer"), "scanned_expiry": strip.get("expiry_date"), "status": status, "match_status": match_status, "medicine_match": medicine_match, "strength_match": strength_match, "frequency_match": True, "expiry_status": expiry, "recall_status": "ACTIVE_ALERT" if recalled else "NO_ALERTS", "interaction_status": "SAFE", "duplicate_status": "DUPLICATE_SCAN" if any(item.get("scanned_batch") == strip.get("batch_number") for item in HISTORY) else "NOT_DETECTED", "created_at": now()}
    HISTORY.insert(0, record)
    warnings = []
    if not medicine_match: warnings.append("MEDICINE MISMATCH: The prescription and strip do not match.")
    if medicine_match and not strength_match: warnings.append("STRENGTH MISMATCH: The prescribed and scanned dose differ.")
    if expiry == "EXPIRED": warnings.append("EXPIRED PRODUCT: Do not consume this medicine.")
    if recalled: warnings.append("ACTIVE RECALL ALERT: Return this batch to the pharmacy.")
    overall = "DANGER" if not medicine_match or expiry == "EXPIRED" or recalled else "ATTENTION_REQUIRED" if not strength_match else "SAFE"
    report = {"id": f"rep_{int(datetime.now().timestamp() * 1000)}", "verification_id": record["id"], "overall_status": overall, "prescription_status": "CONFIRMED", "strip_status": "EXPIRED" if expiry == "EXPIRED" else "VERIFIED", "medicine_match": medicine_match, "strength_match": strength_match, "expiry_status": expiry, "expiry_date": strip.get("expiry_date"), "recall_status": record["recall_status"], "interaction_status": "SAFE", "duplicate_status": record["duplicate_status"], "warnings": warnings, "recommendations": ["Consult a qualified pharmacist or clinician before taking medication."] if warnings else ["Always follow the prescribed frequency and storage guidance."], "created_at": now()}
    return {"success": True, "data": {"record": record, "report": report}}
