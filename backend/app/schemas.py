from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ReceiptBase(BaseModel):
    vendor: str | None = None
    amount: Decimal | None = None
    purchase_date: date | None = None
    category: str | None = None


class ReceiptCreate(ReceiptBase):
    pass


class ReceiptUpdate(ReceiptBase):
    pass


class ReceiptOut(ReceiptBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_path: str | None = None
    raw_ocr_text: str | None = None
    created_at: datetime
    updated_at: datetime


class CategorySummary(BaseModel):
    category: str | None
    total: Decimal
    count: int


class ReceiptSummary(BaseModel):
    total: Decimal
    count: int
    by_category: list[CategorySummary]
