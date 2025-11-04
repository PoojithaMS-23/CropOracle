import os

# API Keys - set these in your environment or in backend/.env
# Example .env entries:
# OPENWEATHER_API_KEY=your_openweather_api_key_here
# MANDI_API_URL=https://example.com/mandi-price

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'your_openweather_api_key_here')
MANDI_API_URL = os.getenv('MANDI_API_URL')

# API Constants
WEATHER_API_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
DEFAULT_COUNTRY = "IN"  # India
WEATHER_UNITS = "metric"  # Celsius

# API Response Timeouts (seconds)
WEATHER_API_TIMEOUT = 10
MANDI_API_TIMEOUT = 8

# Weather API Error Messages
WEATHER_API_ERROR = "Unable to fetch weather data. Please try again later."
CITY_NOT_FOUND_ERROR = "City not found. Please check the city name and try again."
INVALID_API_KEY_ERROR = "Weather service is temporarily unavailable."

# Mandi API Error Messages
MANDI_API_ERROR = "Unable to fetch market prices. Please try again later."
CROP_NOT_FOUND_ERROR = "Price information not available for this crop."
MANDI_API_URL = os.getenv('MANDI_API_URL')  # Optional: third-party mandi price API (expects ?crop=NAME)

# API Base URLs
WEATHER_BASE_URL = os.getenv('WEATHER_BASE_URL', 'http://api.openweathermap.org/data/2.5')
AGRO_BASE_URL = os.getenv('AGRO_BASE_URL', 'http://api.agromonitoring.com/agro/1.0')