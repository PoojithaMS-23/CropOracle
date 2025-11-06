from flask import Blueprint, request, jsonify
from models.model_loader import predict_yield_and_price

predict_bp = Blueprint("predict_bp", __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # ✅ Convert frontend keys into model expected keys
        model_input = {
            "Location": data.get("location"),
            "Area": float(data.get("area")),
            "Rainfall": float(data.get("rainfall")),
            "Temperature": float(data.get("temperature")),
            "Humidity": float(data.get("humidity")),
            "Soil_type": data.get("soilType"),
            "Irrigation": data.get("irrigation"),
            "Crops": data.get("crops"),
            "Season": data.get("season"),
        }

        predicted_yield, predicted_price = predict_yield_and_price(model_input)

        return jsonify({
            "predicted_yield": round(float(predicted_yield), 2),
            "predicted_price": round(float(predicted_price), 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400
