from flask import Blueprint, request, jsonify
from datetime import datetime
from models.MandiWiseData import MandiWiseData
from models.capacity import Capacity
from models.model_loader import predict_yield_and_price
from db_config import get_db_connection      # ⭐ Required to fetch min_price

price_prediction_bp = Blueprint('price_prediction', __name__)

@price_prediction_bp.route('/predict_price', methods=['POST'])
def predict_price():

    data = request.json

    # extract input values
    location   = data.get('location')
    area       = data.get('area')
    rainfall   = data.get('rainfall')
    temperature = data.get('temperature')
    humidity   = data.get('humidity')
    soil_type  = data.get('soilType')
    irrigation = data.get('irrigation')
    crop       = data.get('crop')
    season     = data.get('season')
    mandi      = data.get('mandi')

    timestamp_str = data.get('timestamp')
    timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))

    # ✅ Call Machine Learning model
    predicted_yield, predicted_price = predict_yield_and_price({
        "Location": location,
        "Area": float(area),
        "Rainfall": float(rainfall),
        "Temperature": float(temperature),
        "Humidity": float(humidity),
        "Soil_type": soil_type,
        "Irrigation": irrigation,
        "Crops": crop,
        "Season": season
    })

    # ✅ Do NOT modify — dynamic mandi price logic unchanged
    total_yield = MandiWiseData.get_total_yield_last_15_days(mandi, crop, timestamp)
    total_yield = float(total_yield) if total_yield else 0.0

    max_capacity = Capacity.get_max_capacity(mandi, crop)
    max_capacity = float(max_capacity) if max_capacity else 0.0

    if max_capacity > 0 and total_yield > max_capacity:
        excess_percent = ((total_yield - max_capacity) / max_capacity) * 100
        modified_price = predicted_price * (1 - (excess_percent / 100))
        if modified_price < predicted_price * 0.5:
            modified_price = predicted_price * 0.5
    else:
        modified_price = predicted_price


    # ⭐ NEW PART — if modified_price becomes negative, fetch min_price from DB
    if modified_price < 0:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT min_price FROM admin_price_variations
            WHERE crop_name = %s
        """, (crop,))

        result = cursor.fetchone()
        if result:
            modified_price = float(result["min_price"])

        cursor.close()
        conn.close()


    # ✅ Return ONLY these 3 values
    return jsonify({
        "predicted_price": round(predicted_price, 2),
        "modified_price": round(modified_price, 2),
        "predicted_yield": round(predicted_yield, 2),
    })
