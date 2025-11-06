import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_intent(user_message):
    prompt = f"""
    You are a smart farming assistant. Extract intent based on the user's message.

    Intent Rules:
    - If user asks "what crop should I grow", classify as **crop_suggestion**
    - If user asks "which crops grow in winter / monsoon / summer" → **seasonal_info**
    - If user asks about a specific crop (example: "tomato cultivation", "details about sugarcane") → **crop_details**
    - If message talks about price (market price, MSP, rates) → **price**
    - If message talks about climate, weather, temperature, rainfall → **weather**
    - Otherwise → **general**

    Respond ONLY in JSON format:
    {{
        "intent": "weather | price | general | crop_suggestion | seasonal_info | crop_details",
        "location": "city name if mentioned else null",
        "crop": "crop name if mentioned else null",
        "season": "season/month if mentioned else null"
    }}

    User Message: "{user_message}"
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return json.loads(response.choices[0].message.content)
    except:
        return {
            "intent": "general",
            "location": None,
            "crop": None,
            "season": None
        }
