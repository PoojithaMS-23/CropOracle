from flask import Blueprint, request, jsonify
from db_config import get_db_connection
import datetime

farmer_history_bp = Blueprint("farmer_history_bp", __name__)

@farmer_history_bp.route("/farmer_cultivation_history", methods=["POST"])
def add_farmer_cultivation_history():
    try:
        data = request.get_json()

        conn = get_db_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO farmer_cultivation_history (
                farmer_id, location, area, rainfall, temperature, humidity,
                soil_type, irrigation, crops, season, mandi,
                predicted_price, recalculated_price, yield, created_at, updated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            data.get("farmer_id"),
            data.get("location"),
            data.get("area"),
            data.get("rainfall"),
            data.get("temperature"),
            data.get("humidity"),
            data.get("soil_type"),
            data.get("irrigation"),
            data.get("crops"),
            data.get("season"),
            data.get("mandi"),
            data.get("predicted_price"),
            data.get("modified_price"),   # ✅ this line added
            data.get("predicted_yield"),
            datetime.datetime.now(),  # created_at
            datetime.datetime.now()   # updated_at
        )

        cursor.execute(sql, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "✅ Cultivation history added successfully!"}), 201

    except Exception as e:
        print("Error while saving history:", e)
        return jsonify({"error": str(e)}), 500
