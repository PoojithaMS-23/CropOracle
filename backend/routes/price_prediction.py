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

    # --- Fix timestamp parsing ---
    timestamp_str = data.get('timestamp')  # e.g., '2025-10-26T06:59:28.112Z'
    timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))

    # --- Step 1: Hardcoded predicted price ---
    predicted_price = 5000.0

    # --- Step 2: Get total yield for last 15 days ---
    total_yield = MandiWiseData.get_total_yield_last_15_days(mandi, crop, timestamp)
    total_yield = float(total_yield)  # ensure float

    # --- Step 3: Get max capacity ---
    max_capacity = Capacity.get_max_capacity(mandi, crop)
    max_capacity = float(max_capacity)  # ensure float

    print("Crop:", crop)
    print("Mandi:", mandi)
    print("Timestamp:", timestamp)
    print("Total yield last 15 days:", total_yield)
    print("Max capacity:", max_capacity)

    # --- Step 4: Compare and modify price ---
    if total_yield > 1.10 * max_capacity:
        modified_price = predicted_price * 0.9
    else:
        modified_price = predicted_price

    return jsonify({
        "predicted_price": predicted_price,
        "modified_price": modified_price
    })
