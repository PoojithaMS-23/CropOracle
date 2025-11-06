from flask import Blueprint, request, jsonify
from datetime import timedelta
from db_config import get_db_connection

mandi_routes = Blueprint("mandi_routes", __name__)

GROWTH_TIME = {
    "Wheat": 120, "Rice": 150, "Maize": 110, "Barley": 90, "Cotton": 180,
    "Sugarcane": 330, "Soybean": 140, "Groundnut": 120, "Sunflower": 120,
    "Pulses": 100, "Millet": 90, "Potato": 80, "Tomato": 70
}

@mandi_routes.route("/market-demand", methods=["GET"])
def market_demand():
    try:
        cultivation_id = request.args.get("cultivation_id")
        crop = request.args.get("crop")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True, buffered=True)  # ✅ FIXED

        print("✅ ROUTE HIT: /market-demand", cultivation_id, crop)

        # Fetch main cultivation details
        cursor.execute("""
            SELECT mandi, yield, predicted_price, created_at
            FROM farmer_cultivation_history
            WHERE cultivation_id = %s
        """, (cultivation_id,))
        cultivation = cursor.fetchone()

        if not cultivation:
            return jsonify({"error": "Invalid cultivation ID"}), 404

        mandi = cultivation["mandi"]
        farmer_yield = float(cultivation["yield"])
        predicted_price = float(cultivation["predicted_price"])
        created_at = cultivation["created_at"]

        growth_days = GROWTH_TIME.get(crop, 120)
        start_date = created_at - timedelta(days=growth_days)

        # SUM of yields for same crop, mandi, time window
        cursor.execute("""
            SELECT SUM(yield) AS total_yield
            FROM mandi_wise_data
            WHERE crop = %s AND mandi_name = %s
            AND created_at BETWEEN %s AND %s
        """, (crop, mandi, start_date, created_at))

        row = cursor.fetchone()
        print("🔍 Total yield row:", row)

        total_yield = float(row["total_yield"]) if row["total_yield"] else 0

        # FIRST FARMER CASE
        if total_yield == 0:
            return jsonify({
                "message": "You are the first farmer to sell this crop in this mandi.",
                "crop": crop,
                "mandi": mandi,
                "your_yield": farmer_yield,
                "total_yield_in_mandi": 0,
                "predicted_price": predicted_price,
                "recalculated_price": predicted_price
            })

        # Get max capacity for mandi & crop
        cursor.execute("""
            SELECT capacity.max_capacity
            FROM capacity
            JOIN admin_price_variations ON admin_price_variations.crop_id = capacity.crop_id
            WHERE admin_price_variations.crop_name = %s
            AND capacity.mandi_name = %s
        """, (crop, mandi))

        cap_row = cursor.fetchone()

        max_capacity = float(cap_row["max_capacity"]) if cap_row else None

        if max_capacity is None:
            return jsonify({
                "message": "No capacity data available for this mandi/crop.",
                "crop": crop,
                "mandi": mandi,
                "your_yield": farmer_yield,
                "total_yield_in_mandi": total_yield,
                "predicted_price": predicted_price,
                "recalculated_price": predicted_price
            })

        # PRICE ADJUSTMENT BASED ON CAPACITY
        if total_yield > max_capacity:  # oversupply → decrease price
            percentage = ((total_yield - max_capacity) / max_capacity) * 100
            recalculated_price = predicted_price - (predicted_price * percentage / 100)

        elif total_yield < max_capacity:  # shortage → increase price
            percentage = ((max_capacity - total_yield) / max_capacity) * 100
            recalculated_price = predicted_price + (predicted_price * percentage / 100)

        else:
            recalculated_price = predicted_price

        return jsonify({
            "crop": crop,
            "mandi": mandi,
            "your_yield": farmer_yield,
            "total_yield_in_mandi": total_yield,
            "max_capacity": max_capacity,
            "predicted_price": predicted_price,
            "recalculated_price": round(recalculated_price, 2)
        })

    except Exception as e:
        print("❌ Error (market-demand):", e)
        return jsonify({"error": "Demand fetch failed"}), 500
