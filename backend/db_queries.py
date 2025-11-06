# db_queries.py

from db_config import get_db_connection


# ✅ Fetch latest mandi price based on crop name
def fetch_latest_price(crop_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT mandi_name, crop, predicted_price, timestamp
        FROM mandi_wise_data
        WHERE crop = %s
        ORDER BY timestamp DESC
        LIMIT 1
    """

    cursor.execute(query, (crop_name,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result   # Example output: {"mandi_name": "Hyderabad", "predicted_price": 4500}


# ✅ Fetch crop yield history of a farmer
def fetch_yield_history(farmer_id):
    conn = get_connection_db()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT crop, yield_quantity, season, timestamp
        FROM farmer_cultivation_history
        WHERE farmer_id = %s
        ORDER BY timestamp DESC
    """

    cursor.execute(query, (farmer_id,))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return results   # Example list: [{"crop": "Rice", "yield_quantity": 1200}, ...]
