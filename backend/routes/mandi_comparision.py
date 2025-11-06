from flask import Blueprint, request, jsonify
from datetime import datetime
from models.MandiWiseData import MandiWiseData
from models.capacity import Capacity
from models.model_loader import predict_yield_and_price
from db_config import get_db_connection

mandi_comparison_bp = Blueprint("mandi_comparison", __name__)

@mandi_comparison_bp.route("/predict_price_multiple", methods=["POST"])
def predict_price_multiple():
    data = request.json

    mandis = data.get("mandis", [])
    if not mandis:
        return jsonify({"error": "No mandis provided"}), 400

    # Extract common details from first mandi
    location = data.get("location")
    area = float(data.get("area", 0))
    rainfall = float(data.get("rainfall", 0))
    temperature = float(data.get("temperature", 0))
    humidity = float(data.get("humidity", 0))
    soil_type = data.get("soilType")
    irrigation = data.get("irrigation")
    crop = data.get("crop")
    season = data.get("season")
    timestamp_str = data.get("timestamp")
    timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))

    # Call ML model once (predicted price same for all mandis)
    predicted_yield, predicted_price = predict_yield_and_price({
        "Location": location,
        "Area": area,
        "Rainfall": rainfall,
        "Temperature": temperature,
        "Humidity": humidity,
        "Soil_type": soil_type,
        "Irrigation": irrigation,
        "Crops": crop,
        "Season": season
    })

    results = []
    for mandi_name in mandis:
        mandi_name = mandi_name.strip()
        if not mandi_name:
            continue

        # Calculate modified price per mandi
        total_yield = MandiWiseData.get_total_yield_last_15_days(mandi_name, crop, timestamp)
        total_yield = float(total_yield) if total_yield else 0.0

        max_capacity = Capacity.get_max_capacity(mandi_name, crop)
        max_capacity = float(max_capacity) if max_capacity else 0.0

        if max_capacity > 0 and total_yield > max_capacity:
            excess_percent = ((total_yield - max_capacity) / max_capacity) * 100
            modified_price = predicted_price * (1 - (excess_percent / 100))
            if modified_price < predicted_price * 0.5:
                modified_price = predicted_price * 0.5
        else:
            modified_price = predicted_price

        # If modified_price < 0, get min_price from DB
        if modified_price < 0:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT min_price FROM admin_price_variations WHERE crop_name=%s", (crop,))
            result = cursor.fetchone()
            if result:
                modified_price = float(result["min_price"])
            cursor.close()
            conn.close()

        results.append({
            "mandi": mandi_name,
            "predicted_price": round(predicted_price, 2),
            "modified_price": round(modified_price, 2),
            "predicted_yield": round(predicted_yield, 2)
        })

    return jsonify(results)
