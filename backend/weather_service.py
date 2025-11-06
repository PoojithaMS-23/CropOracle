import requests
import os

API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather_forecast(city):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        data = requests.get(url).json()

        description = data["weather"][0]["description"].capitalize()
        temperature = data["main"]["temp"]

        return f"☁️ Weather in {city}: {description}, {temperature}°C"

    except:
        return f"⚠️ Unable to fetch weather for {city}."
