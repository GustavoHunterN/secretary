from sqlalchemy import Column, Date, DateTime, Integer, Numeric, String, Text, func

from app.database import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    vendor = Column(String(255), nullable=True)
    amount = Column(Numeric(10, 2), nullable=True)
    purchase_date = Column(Date, nullable=True)
    category = Column(String(100), nullable=True, index=True)
    image_path = Column(String(500), nullable=True)
    raw_ocr_text = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
