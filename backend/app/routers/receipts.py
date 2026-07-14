import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app import crud, schemas
from app.config import settings
from app.database import get_db
from app.ocr import OCRNotConfiguredError, extract_text, parse_receipt_text

router = APIRouter(prefix="/receipts", tags=["receipts"])


@router.post("", response_model=schemas.ReceiptOut)
def create_receipt(payload: schemas.ReceiptCreate, db: Session = Depends(get_db)):
    return crud.create_receipt(db, payload.model_dump())


@router.post("/upload", response_model=schemas.ReceiptOut)
async def upload_receipt(
    file: UploadFile = File(...), db: Session = Depends(get_db)
):
    content = await file.read()

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "").suffix or ".jpg"
    stored_name = f"{uuid.uuid4().hex}{suffix}"
    stored_path = upload_dir / stored_name
    stored_path.write_bytes(content)

    raw_text = ""
    extracted = {}
    try:
        raw_text = extract_text(content)
        extracted = parse_receipt_text(raw_text)
    except OCRNotConfiguredError as exc:
        raw_text = f"[OCR unavailable: {exc}]"

    data = {
        "vendor": extracted.get("vendor"),
        "amount": extracted.get("amount"),
        "purchase_date": extracted.get("purchase_date"),
        "category": None,
        "image_path": str(stored_path),
        "raw_ocr_text": raw_text,
    }
    return crud.create_receipt(db, data)


@router.get("", response_model=list[schemas.ReceiptOut])
def list_receipts(
    category: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.get_receipts(db, category=category, skip=skip, limit=limit)


@router.get("/summary", response_model=schemas.ReceiptSummary)
def receipts_summary(db: Session = Depends(get_db)):
    return crud.get_summary(db)


@router.get("/{receipt_id}", response_model=schemas.ReceiptOut)
def get_receipt(receipt_id: int, db: Session = Depends(get_db)):
    receipt = crud.get_receipt(db, receipt_id)
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return receipt


@router.patch("/{receipt_id}", response_model=schemas.ReceiptOut)
def update_receipt(
    receipt_id: int, payload: schemas.ReceiptUpdate, db: Session = Depends(get_db)
):
    receipt = crud.get_receipt(db, receipt_id)
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return crud.update_receipt(db, receipt, payload)


@router.delete("/{receipt_id}", status_code=204)
def delete_receipt(receipt_id: int, db: Session = Depends(get_db)):
    receipt = crud.get_receipt(db, receipt_id)
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    crud.delete_receipt(db, receipt)
