from flask import Blueprint, jsonify
from db_config import get_db_connection

cultivation_bp = Blueprint("cultivation", __name__)

@cultivation_bp.route("/get_current_cultivations/<int:farmer_id>", methods=["GET"])
def get_current_cultivations(farmer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT *
            FROM farmer_cultivation_history
            WHERE farmer_id = %s
            AND cultivation_id NOT IN (
                SELECT cultivation_id FROM mandi_wise_data WHERE farmer_id = %s
            );
        """

        cursor.execute(query, (farmer_id, farmer_id))
        result = cursor.fetchall()

        return jsonify(result), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to fetch cultivations"}), 500
    
    finally:
        cursor.close()
        conn.close()
