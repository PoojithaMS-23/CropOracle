from flask import Blueprint, request, jsonify
from datetime import datetime
from models.MandiWiseData import MandiWiseData
from models.capacity import Capacity

price_prediction_bp = Blueprint('price_prediction', __name__)

@price_prediction_bp.route('/predict_price', methods=['POST'])
def predict_price():
    data = request.json
    crop = data.get('crop')
    mandi = data.get('mandi')

    # --- Parse timestamp ---
    timestamp_str = data.get('timestamp')  # e.g., '2025-10-26T06:59:28.112Z'
    timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))

    # --- Step 1: Hardcoded predicted price (example) ---
    predicted_price = 5000.0

    # --- Step 2: Get total yield for last 15 days ---
    total_yield = MandiWiseData.get_total_yield_last_15_days(mandi, crop, timestamp)
    total_yield = float(total_yield) if total_yield else 0.0

    # --- Step 3: Get max capacity ---
    max_capacity = Capacity.get_max_capacity(mandi, crop)
    max_capacity = float(max_capacity) if max_capacity else 0.0

    print("Crop:", crop)
    print("Mandi:", mandi)
    print("Timestamp:", timestamp)
    print("Total yield last 15 days:", total_yield)
    print("Max capacity:", max_capacity)

    # --- Step 4: Dynamic price adjustment ---
    if max_capacity > 0 and total_yield > max_capacity:
        excess_percent = ((total_yield - max_capacity) / max_capacity) * 100
        modified_price = predicted_price * (1 - (excess_percent / 100))
        # prevent price from dropping below 50% arbitrarily
        if modified_price < predicted_price * 0.5:
            modified_price = predicted_price * 0.5
    else:
        modified_price = predicted_price

    # --- Step 5: Hardcoded predicted yield (temporary) ---
    predicted_yield = 3.75  # example yield in tons/acre

    return jsonify({
        "predicted_price": predicted_price,
        "modified_price": round(modified_price, 2),
        "predicted_yield": predicted_yield
    })
