from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Cargo Service")


class CargoQuoteRequest(BaseModel):
    distance_km: float = Field(gt=0)
    weight_kg: float = Field(gt=0)


class ShipmentStatus(BaseModel):
    shipment_id: str
    status: str
    eta_hours: int


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "cargo"}


@app.post("/quote")
def quote(payload: CargoQuoteRequest) -> dict[str, float]:
    base_fee = 5.0
    distance_rate = 0.4
    weight_rate = 0.2
    total = base_fee + payload.distance_km * distance_rate + payload.weight_kg * weight_rate
    return {"estimated_cost": round(total, 2)}


@app.get("/shipments/{shipment_id}")
def shipment_tracking(shipment_id: str) -> ShipmentStatus:
    return ShipmentStatus(shipment_id=shipment_id, status="in_transit", eta_hours=6)
