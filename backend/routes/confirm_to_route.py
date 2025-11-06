from flask import Blueprint, request, jsonify
from db_config import get_db_connection

confirm_to_route = Blueprint("confirm_to_route", __name__)

@confirm_to_route.route("/api/confirm_to", methods=["POST"])
def confirm_to():
    try:
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        # ✅ 1. INSERT into farmer_cultivation_history
        insert_cultivation_query = """
            INSERT INTO farmer_cultivation_history 
            (farmer_id, location, area, rainfall, temperature, humidity, soil_type, irrigation, crops, 
             season, mandi, predicted_price, recalculated_price, `yield`)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cultivation_values = (
            data["farmer_id"], data["location"], data["area"], data["rainfall"], data["temperature"],
            data["humidity"], data["soil_type"], data["irrigation"], data["crops"], data["season"],
            data["mandi"], data["predicted_price"], data["recalculated_price"], data["yield"]
        )

        cursor.execute(insert_cultivation_query, cultivation_values)
        conn.commit()

        # ✅ Get generated cultivation_id
        cultivation_id = cursor.lastrowid

        # ✅ 2. INSERT into mandi_wise_data
        insert_mandi_query = """
            INSERT INTO mandi_wise_data (farmer_id, cultivation_id, mandi_name, crop, `yield`)
            VALUES (%s, %s, %s, %s, %s)
        """

        mandi_values = (
            data["farmer_id"], cultivation_id, data["mandi"], data["crops"], data["yield"]
        )

        cursor.execute(insert_mandi_query, mandi_values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Saved to cultivation history & mandi wise data"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
