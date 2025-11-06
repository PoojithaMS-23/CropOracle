from flask import Blueprint, request, jsonify
from intent import extract_intent
from nlp_router import route_user_query   # ✅ NEW import for routing logic
from weather_service import get_weather_forecast
from openai import OpenAI

client = OpenAI()

chatbot_bp = Blueprint("chatbot_bp", __name__)

@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"reply": "❌ Message is empty"}), 400

        # 1️⃣ Extract intent (weather, price, crop suggestions etc.)
        intent_data = extract_intent(user_message)
        intent = intent_data.get("intent")

        # ⭐ NEW HANDLING (crop suggestion / seasonal info / crop details)
        if intent in ["crop_suggestion", "seasonal_info", "crop_details"]:
            reply = route_user_query(user_message)
            return jsonify({"reply": reply})

        # ✅ Existing Weather Logic (untouched)
        if intent == "weather":
            city = intent_data.get("location", "Bangalore")
            weather = get_weather_forecast(city)
            return jsonify({"reply": weather})

        # ✅ Existing OpenAI fallback (untouched)
        chat_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful chatbot for a crop price prediction system."},
                {"role": "user", "content": user_message}
            ]
        )

        bot_reply = chat_response.choices[0].message["content"]

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print("Chatbot error:", e)
        return jsonify({"reply": "⚠️ Server Error. Try again later."}), 500
