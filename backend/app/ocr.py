import re
from datetime import date, datetime
from decimal import Decimal, InvalidOperation

_vision_client = None

_DATE_PATTERNS = [
    (r"\b(\d{4})-(\d{1,2})-(\d{1,2})\b", "%Y-%m-%d"),
    (r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b", "%m/%d/%Y"),
    (r"\b(\d{1,2})-(\d{1,2})-(\d{4})\b", "%m-%d-%Y"),
]

_TOTAL_LINE_RE = re.compile(r"(total|amount due|balance due)\D{0,10}(\d+[.,]\d{2})", re.IGNORECASE)
_ANY_AMOUNT_RE = re.compile(r"\$?\s?(\d{1,5}[.,]\d{2})")


class OCRNotConfiguredError(RuntimeError):
    pass


def _get_client():
    global _vision_client
    if _vision_client is None:
        try:
            from google.cloud import vision
        except ImportError as exc:
            raise OCRNotConfiguredError(
                "google-cloud-vision is not installed"
            ) from exc
        try:
            _vision_client = vision.ImageAnnotatorClient()
        except Exception as exc:
            raise OCRNotConfiguredError(
                "Could not initialize Google Vision client. "
                "Set GOOGLE_APPLICATION_CREDENTIALS to a valid service account JSON."
            ) from exc
    return _vision_client


def extract_text(image_bytes: bytes) -> str:
    from google.cloud import vision

    client = _get_client()
    image = vision.Image(content=image_bytes)
    response = client.text_detection(image=image)
    if response.error.message:
        raise RuntimeError(f"Vision API error: {response.error.message}")
    annotations = response.text_annotations
    return annotations[0].description if annotations else ""


def _parse_amount(text: str) -> Decimal | None:
    match = _TOTAL_LINE_RE.search(text)
    candidates = [match.group(2)] if match else _ANY_AMOUNT_RE.findall(text)
    if not candidates:
        return None
    best = max(candidates, key=lambda s: Decimal(s.replace(",", ".")))
    try:
        return Decimal(best.replace(",", "."))
    except InvalidOperation:
        return None


def _parse_date(text: str) -> date | None:
    for pattern, fmt in _DATE_PATTERNS:
        match = re.search(pattern, text)
        if match:
            try:
                return datetime.strptime(match.group(0), fmt).date()
            except ValueError:
                continue
    return None


def _parse_vendor(text: str) -> str | None:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped:
            return stripped[:255]
    return None


def parse_receipt_text(text: str) -> dict:
    return {
        "vendor": _parse_vendor(text),
        "amount": _parse_amount(text),
        "purchase_date": _parse_date(text),
    }
