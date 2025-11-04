from datetime import datetime
from db_config import db  # SQLAlchemy instance

class FarmerCultivationHistory(db.Model):
    __tablename__ = 'farmer_cultivation_history'

    cultivation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    farmer_id = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    area = db.Column(db.Float, nullable=False)
    rainfall = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    soil_type = db.Column(db.String(50), nullable=False)
    irrigation = db.Column(db.String(50), nullable=False)
    crops = db.Column(db.String(100), nullable=False)
    season = db.Column(db.String(50), nullable=False)
    mandi = db.Column(db.String(100), nullable=False)
    
    predicted_price = db.Column(db.Float)
    recalculated_price = db.Column(db.Float)  # ✅ newly added
    yield_amount = db.Column(db.Float, nullable=False)  # renamed from yield
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
