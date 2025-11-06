from datetime import datetime
from db_config import get_db_connection  # SQLAlchemy Instance

db = get_db_connection()

class MandiWiseData(db.Model):
    __tablename__ = "mandi_wise_data"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    farmer_id = db.Column(db.Integer, nullable=False)
    cultivation_id = db.Column(db.Integer, nullable=False)
    mandi_name = db.Column(db.String(100), nullable=False)
    crop = db.Column(db.String(100), nullable=False)
    yield_amount = db.Column(db.Float, nullable=False)  # column name must match DB
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
