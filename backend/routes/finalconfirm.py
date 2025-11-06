from flask import Blueprint, request, jsonify
from db_config import get_db_connection
from datetime import datetime, timedelta

final_confirm_bp = Blueprint("final_confirm", __name__)

# ✅ Crop growing duration (in days)
crop_days = {
    "Wheat": 120, "Rice": 150, "Maize": 110, "Barley": 90,
    "Cotton": 180, "Sugarcane": 330, "Soybean": 140, "Groundnut": 120,
    "Sunflower": 120, "Pulses": 100, "Millet": 90, "Potato": 80, "Tomato": 70
}

@final_confirm_bp.route("/final-confirm", methods=["POST"])
def confirm_mandi_data():
    try:
        data = request.json
        print("📥 Incoming Data ->", data)

        required_fields = ["farmer_id", "cultivation_id", "mandi_name", "crop", "yield"]
        missing = [field for field in required_fields if field not in data]

        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        crop_name = data["crop"]

        # ✅ Calculate timestamp = NOW() - crop growing time
        days_to_subtract = crop_days.get(crop_name.capitalize(), 100)  # default 100 days
        created_timestamp = datetime.now() - timedelta(days=days_to_subtract)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO mandi_wise_data 
            (farmer_id, cultivation_id, mandi_name, crop, yield, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                data["farmer_id"],
                data["cultivation_id"],
                data["mandi_name"],
                crop_name,
                data["yield"],
                created_timestamp,
            ),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "✅ Data inserted successfully"}), 201

    except Exception as e:
        print("❌ Error inserting mandi data:", e)
        return jsonify({"error": "Insert failed"}), 500
