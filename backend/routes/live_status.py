from flask import Blueprint, jsonify
from db_config import get_db_connection

live_status_bp = Blueprint('live_status', __name__)

@live_status_bp.route('/mandis', methods=['GET'])
def get_all_mandis():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT mandi_name FROM mandi_wise_data")
    mandis = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(mandis)


@live_status_bp.route('/mandi_crop_yield/<mandi_name>', methods=['GET'])
def get_mandi_crop_yield(mandi_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 1️⃣ Get total yield for each crop in mandi_wise_data
    cursor.execute("""
        SELECT crop, SUM(yield) AS total_yield
        FROM mandi_wise_data
        WHERE mandi_name = %s
        GROUP BY crop
    """, (mandi_name,))
    mandi_data = cursor.fetchall()

    # 2️⃣ Get capacity for crops in this mandi
    cursor.execute("""
        SELECT c.mandi_name, ap.crop_name AS crop, c.max_capacity
        FROM capacity c
        JOIN admin_price_variations ap ON c.crop_id = ap.crop_id
        WHERE c.mandi_name = %s
    """, (mandi_name,))
    capacity_data = cursor.fetchall()

    # Convert capacity info to dict for fast lookup
    capacity_dict = {row["crop"]: float(row["max_capacity"]) for row in capacity_data}

    # 3️⃣ Combine results
    result = []
    for row in mandi_data:
        crop_name = row["crop"]
        total_yield = float(row["total_yield"])
        max_capacity = capacity_dict.get(crop_name, 0.0)
        capacity_hit = total_yield >= max_capacity if max_capacity > 0 else False

        result.append({
            "crop": crop_name,
            "total_yield": total_yield,
            "max_capacity": max_capacity,
            "capacity_hit": capacity_hit
        })

    cursor.close()
    conn.close()
    return jsonify(result)
@live_status_bp.route('/crops', methods=['GET'])
def get_all_crops():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT crop FROM mandi_wise_data")
    crops = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(crops)

@live_status_bp.route('/crop_mandi_yield/<crop_name>', methods=['GET'])
def get_crop_mandi_yield(crop_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 1️⃣ Get total yield for each mandi for this crop
    cursor.execute("""
        SELECT mandi_name, SUM(yield) AS total_yield
        FROM mandi_wise_data
        WHERE crop = %s
        GROUP BY mandi_name
    """, (crop_name,))
    mandi_data = cursor.fetchall()

    # 2️⃣ Get capacity for this crop in each mandi
    cursor.execute("""
        SELECT c.mandi_name, ap.crop_name AS crop, c.max_capacity
        FROM capacity c
        JOIN admin_price_variations ap ON c.crop_id = ap.crop_id
        WHERE ap.crop_name = %s
    """, (crop_name,))
    capacity_data = cursor.fetchall()

    # Convert to dictionary for fast lookup
    capacity_dict = {row["mandi_name"]: float(row["max_capacity"]) for row in capacity_data}

    # 3️⃣ Combine data
    result = []
    for row in mandi_data:
        mandi_name = row["mandi_name"]
        total_yield = float(row["total_yield"])
        max_capacity = capacity_dict.get(mandi_name, 0.0)
        capacity_hit = total_yield >= max_capacity if max_capacity > 0 else False

        result.append({
            "mandi_name": mandi_name,
            "total_yield": total_yield,
            "max_capacity": max_capacity,
            "capacity_hit": capacity_hit
        })

    cursor.close()
    conn.close()
    return jsonify(result)

