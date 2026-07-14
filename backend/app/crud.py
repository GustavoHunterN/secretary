from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas


def create_receipt(db: Session, data: dict) -> models.Receipt:
    receipt = models.Receipt(**data)
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


def get_receipt(db: Session, receipt_id: int) -> models.Receipt | None:
    return db.get(models.Receipt, receipt_id)


def get_receipts(
    db: Session, category: str | None = None, skip: int = 0, limit: int = 100
) -> list[models.Receipt]:
    query = db.query(models.Receipt)
    if category:
        query = query.filter(models.Receipt.category == category)
    return (
        query.order_by(
            models.Receipt.purchase_date.is_(None), models.Receipt.purchase_date.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_receipt(
    db: Session, receipt: models.Receipt, data: schemas.ReceiptUpdate
) -> models.Receipt:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(receipt, field, value)
    db.commit()
    db.refresh(receipt)
    return receipt


def delete_receipt(db: Session, receipt: models.Receipt) -> None:
    db.delete(receipt)
    db.commit()


def get_summary(db: Session) -> dict:
    total, count = db.query(
        func.coalesce(func.sum(models.Receipt.amount), 0), func.count(models.Receipt.id)
    ).one()

    by_category_rows = (
        db.query(
            models.Receipt.category,
            func.coalesce(func.sum(models.Receipt.amount), 0),
            func.count(models.Receipt.id),
        )
        .group_by(models.Receipt.category)
        .all()
    )

    return {
        "total": total,
        "count": count,
        "by_category": [
            {"category": cat, "total": tot, "count": cnt}
            for cat, tot, cnt in by_category_rows
        ],
    }
