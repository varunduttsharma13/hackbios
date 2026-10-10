# MED-BRIDGE FastAPI backend

This standalone service mirrors the Next.js API response contract and supplies the prescription-analysis, registry lookup, safety, matching, alert, history, and profile endpoints. It starts with in-memory demo data, suitable for the existing hackathon/demo workflow.

## Run locally

From the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open http://127.0.0.1:8000/docs to inspect and exercise every endpoint through FastAPI's interactive Swagger UI.

## Endpoint check guide

Keep the server running, then open a second PowerShell window in `backend` and run:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
Invoke-RestMethod http://127.0.0.1:8000/api/medicines
Invoke-RestMethod -Method Post http://127.0.0.1:8000/api/prescription/analyze -ContentType 'application/json' -Body '{"preset":"metformin_atorvastatin"}'
Invoke-RestMethod -Method Post http://127.0.0.1:8000/api/medicine/scan -ContentType 'application/json' -Body '{"code":"DS-MET-500-A","scanType":"QR"}'
Invoke-RestMethod -Method Post http://127.0.0.1:8000/api/match -ContentType 'application/json' -Body '{"prescribed":{"medicine_name":"Metformin","strength":"500 mg","frequency":"Twice daily"},"stripItem":{"medicine_name":"Metformin 500 mg","strength":"500 mg","batch_number":"MET500A","manufacturer":"Sun Pharma Ltd.","expiry_date":"Aug 2026","verification_status":"VERIFIED"}}'
```

Expected checks: `/health` returns `status: ok`; the scan returns `Metformin 500 mg`; the match response has `data.report.overall_status` of `SAFE`. For an intentional mismatch, scan `DS-AZI-500-A` and submit it as `stripItem` to `/api/match`.

## Frontend connection

Create or update the frontend `.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Then restart `npm run dev`. The frontend calls this server for prescription analysis, strip scan lookup, and initial medicines/alerts/history data. If that variable is omitted, it keeps using the original built-in Next API routes.
