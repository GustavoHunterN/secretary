from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routers import receipts

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secretary")
app.include_router(receipts.router)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/health")
def health():
    return {"status": "ok"}
