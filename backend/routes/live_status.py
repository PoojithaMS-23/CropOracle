from flask import Blueprint, jsonify, request
from db_config import get_db_connection

live_status_bp = Blueprint("livestatus", __name__)

# ✅ Get all mandis
@live_status_bp.route("/mandis", methods=["GET"])
def get_all_mandis():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT mandi_name FROM mandi_wise_data")
    data = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(data)

# ✅ Get crop-wise data of a mandi
@live_status_bp.route("/mandi/<mandi_name>", methods=["GET"])
def get_mandi_crop_data(mandi_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT crop, SUM(yield) AS yield
        FROM mandi_wise_data
        WHERE mandi_name = %s
        GROUP BY crop
    """, (mandi_name,))
    resp = cursor.fetchall()
    conn.close()
    return jsonify(resp)

# ✅ Get mandi-wise yield of a crop
@live_status_bp.route("/crop/<crop_name>", methods=["GET"])
def get_crop_all_mandis_data(crop_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT mandi_name, SUM(yield) AS total_yield
        FROM mandi_wise_data
        WHERE crop = %s
        GROUP BY mandi_name
    """, (crop_name,))
    resp = cursor.fetchall()
    conn.close()
    return jsonify(resp)

# ✅ Get max capacity table
@live_status_bp.route('/capacity', methods=['GET'])
def get_capacity():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                c.mandi_name,
                apv.crop_name AS crop,
                c.max_capacity
            FROM capacity c
            INNER JOIN admin_price_variations apv
                ON c.crop_id = apv.crop_id;
        """)

        data = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "data": data})

    except Exception as e:
        print("Error in get_capacity:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
