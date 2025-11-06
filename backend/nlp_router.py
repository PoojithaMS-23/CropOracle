import json
from intent import extract_intent
from weather_service import get_weather_forecast   # ✅ already correct

# ✅ REMOVE "services." since there is no services folder
from price_service import get_price
from crop_service import get_crop_suggestion
from seasonal_service import get_seasonal_info
from crop_details_service import get_crop_details


def route_user_query(user_message):
    """
    Routes the user query to appropriate handler based on detected intent.
    """

    intent_data = extract_intent(user_message)

    print("🔍 Intent detected:", intent_data)  # Debugging

    intent = intent_data.get("intent", "general")
    crop = intent_data.get("crop")
    location = intent_data.get("location")
    date_range = intent_data.get("date_range")

    # ------------------ ✅ Weather Query ------------------
    if intent == "weather":
        if not location:
            return "🌦️ Please provide a location to check weather."
        return get_weather_forecast(location, date_range)

    # ------------------ ✅ Crop Price Prediction ------------------
    elif intent == "predict_price":
        if not crop:
            return "📉 Please mention the crop name for price prediction."
        return get_price(crop, location)

    # ------------------ ✅ NEW: Crop Suggestion Intent ------------------
    elif intent == "crop_suggestion":
        return get_crop_suggestion(location)

    # ------------------ ✅ NEW: Seasonal Info Intent ------------------
    elif intent == "seasonal_info":
        return get_seasonal_info()

    # ------------------ ✅ NEW: Crop Details Intent ------------------
    elif intent == "crop_details":
        if not crop:
            return "🌿 Please mention a crop name."
        return get_crop_details(crop)

    # ------------------ ✅ General Conversation ------------------
    else:
        return "❓ I'm not sure I understood. Try asking about weather, crop pricing, or crop suggestions."
