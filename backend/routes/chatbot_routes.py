from flask import Blueprint, request, jsonify, current_app
from models.chatbot_model import ChatMessage
import requests
from datetime import datetime
import json
import os
import logging
from dotenv import load_dotenv
from config.api_config import (
    WEATHER_API_BASE_URL, DEFAULT_COUNTRY, WEATHER_UNITS,
    WEATHER_API_TIMEOUT, MANDI_API_TIMEOUT,
    WEATHER_API_ERROR, CITY_NOT_FOUND_ERROR, INVALID_API_KEY_ERROR,
    MANDI_API_ERROR, CROP_NOT_FOUND_ERROR
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

chatbot = Blueprint('chatbot', __name__)

# Dictionary of crops with detailed information
CROP_INFO = {
    'rice': {
        'seasons': ['kharif', 'monsoon'],
        'sowing_time': 'June-July',
        'harvesting_time': 'November-December',
        'optimal_temperature': '20-35°C',
        'water_requirement': 'High',
        'soil_type': 'Clay or clay loam soil',
        'description': 'Rice is a major staple crop that requires standing water and warm temperatures.'
    },
    'wheat': {
        'seasons': ['rabi', 'winter'],
        'sowing_time': 'October-December',
        'harvesting_time': 'March-April',
        'optimal_temperature': '15-25°C',
        'water_requirement': 'Moderate',
        'soil_type': 'Well-drained loamy soil',
        'description': 'Wheat is a winter crop that needs cool temperatures during growth and warm temperatures during maturity.'
    },
    'cotton': {
        'seasons': ['kharif', 'monsoon'],
        'sowing_time': 'March-May',
        'harvesting_time': 'October-November',
        'optimal_temperature': '21-30°C',
        'water_requirement': 'Moderate',
        'soil_type': 'Deep black soil or alluvial soil',
        'description': 'Cotton requires a warm and humid climate with moderate rainfall.'
    },
    'sugarcane': {
        'seasons': ['year-round'],
        'sowing_time': 'January-March or June-July',
        'harvesting_time': 'December-March',
        'optimal_temperature': '20-35°C',
        'water_requirement': 'High',
        'soil_type': 'Deep rich loamy soil',
        'description': 'Sugarcane is a long-duration crop that can be grown year-round in tropical conditions.'
    },
    'maize': {
        'seasons': ['kharif', 'rabi'],
        'sowing_time': 'Kharif: June-July, Rabi: October-November',
        'harvesting_time': 'Kharif: September-October, Rabi: February-March',
        'optimal_temperature': '20-30°C',
        'water_requirement': 'Moderate',
        'soil_type': 'Well-drained loamy soil',
        'description': 'Maize can be grown in both seasons and requires moderate rainfall.'
    },
    'pulses': {
        'seasons': ['rabi'],
        'sowing_time': 'October-November',
        'harvesting_time': 'February-March',
        'optimal_temperature': '20-25°C',
        'water_requirement': 'Low',
        'soil_type': 'Well-drained loamy soil',
        'description': 'Pulses are nitrogen-fixing crops that improve soil fertility.'
    },
    'vegetables': {
        'seasons': ['year-round'],
        'sowing_time': 'Varies by vegetable type',
        'harvesting_time': 'Varies by vegetable type',
        'optimal_temperature': '15-30°C',
        'water_requirement': 'Moderate',
        'soil_type': 'Rich loamy soil with good drainage',
        'description': 'Different vegetables can be grown throughout the year based on local climate.'
    }
}

# Dictionary of seasonal information
SEASON_INFO = {
    'kharif': {
        'months': 'June to October',
        'rainfall': 'Monsoon dependent',
        'major_crops': ['rice', 'maize', 'cotton', 'sugarcane', 'groundnut'],
        'description': 'Main monsoon season with warm temperatures and high rainfall'
    },
    'rabi': {
        'months': 'October to March',
        'rainfall': 'Winter rainfall and irrigation',
        'major_crops': ['wheat', 'barley', 'pulses', 'mustard'],
        'description': 'Winter season with moderate to cool temperatures'
    },
    'zaid': {
        'months': 'March to June',
        'rainfall': 'Irrigation dependent',
        'major_crops': ['vegetables', 'fruits', 'fodder crops'],
        'description': 'Short season between rabi and kharif, primarily for short-duration crops'
    }
}

# Mandi information
MANDI_INFO = {
    'types': ['Primary Market', 'Secondary Market', 'Terminal Market'],
    'services': ['Price Discovery', 'Storage', 'Grading', 'Payment'],
    'documents_needed': ['Identity Proof', 'Land Records', 'Bank Account Details'],
    'best_practices': [
        'Check current market rates before selling',
        'Ensure proper grading of produce',
        'Keep all documents ready',
        'Compare rates across different mandis',
        'Consider storage if prices are low'
    ]
}

def get_weather_info(city):
    """
    Get weather information for a city with enhanced error handling and logging.
    Falls back to simulation if API call fails.
    
    Args:
        city (str): Name of the city to get weather for
        
    Returns:
        dict: Weather information including temperature, humidity, etc.
        
    Raises:
        requests.exceptions.RequestException: If API request fails
    """
    api_key = os.getenv('OPENWEATHER_API_KEY')
    
    try:
        if not api_key or api_key == 'your_openweather_api_key_here':
            logger.warning("OpenWeather API key not configured, using simulated data")
            raise ValueError("API key not configured")

        url = f"{WEATHER_API_BASE_URL}?q={city},{DEFAULT_COUNTRY}&appid={api_key}&units={WEATHER_UNITS}"
        logger.info(f"Fetching weather data for city: {city}")
        
        response = requests.get(url, timeout=WEATHER_API_TIMEOUT)
        
        if response.status_code == 200:
            data = response.json()
            weather_data = {
                'temperature': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'description': data['weather'][0]['description'],
                'wind_speed': data['wind']['speed'],
                'pressure': data['main']['pressure'],
                'feels_like': data['main']['feels_like']
            }
            logger.info(f"Successfully retrieved weather data for {city}")
            return weather_data
            
        elif response.status_code == 404:
            logger.error(f"City not found: {city}")
            raise ValueError(CITY_NOT_FOUND_ERROR)
            
        elif response.status_code == 401:
            logger.error("Invalid API key")
            raise ValueError(INVALID_API_KEY_ERROR)
            
        else:
            logger.error(f"Weather API error: {response.status_code} - {response.text}")
            raise requests.exceptions.RequestException(WEATHER_API_ERROR)
            
    except (requests.exceptions.RequestException, ValueError) as e:
        logger.error(f"Error fetching weather data: {str(e)}")
        
        # Fallback to simulated data
        import random
        weather_conditions = [
            "clear sky",
            "few clouds",
            "scattered clouds",
            "light rain",
            "moderate rain",
            "sunny"
        ]
        
        simulated_data = {
            'temperature': round(random.uniform(20, 35), 1),
            'humidity': random.randint(40, 90),
            'description': random.choice(weather_conditions),
            'wind_speed': round(random.uniform(0, 10), 1),
            'pressure': random.randint(1000, 1020),
            'feels_like': round(random.uniform(20, 35), 1),
            'simulated': True  # Flag to indicate this is simulated data
        }
        
        logger.info("Using simulated weather data as fallback")
        return simulated_data


def get_mandi_prices(crop_name):
    """
    Fetch mandi prices for a crop with enhanced error handling and logging.
    
    Args:
        crop_name (str): Name of the crop to get prices for
        
    Returns:
        dict: Price information including current price, trend, and last updated time
              or None if the crop is not found
    """
    mandi_api = os.getenv('MANDI_API_URL')
    logger.info(f"Fetching mandi prices for crop: {crop_name}")
    
    try:
        if mandi_api:
            try:
                resp = requests.get(
                    mandi_api,
                    params={'crop': crop_name},
                    timeout=MANDI_API_TIMEOUT
                )
                
                if resp.status_code == 200:
                    try:
                        data = resp.json()
                    except json.JSONDecodeError:
                        # If API returns plain text or number
                        text = resp.text.strip()
                        try:
                            price_val = float(text)
                            logger.info(f"Parsed numeric price value: {price_val}")
                            return {
                                'price': price_val,
                                'trend': 'unknown',
                                'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M'),
                                'source': 'api'
                            }
                        except ValueError:
                            logger.error("Failed to parse API response as number")
                            raise ValueError(MANDI_API_ERROR)

                    # If API returns a numeric directly inside json
                    if isinstance(data, (int, float)):
                        logger.info(f"Received numeric JSON value: {data}")
                        return {
                            'price': float(data),
                            'trend': 'unknown',
                            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M'),
                            'source': 'api'
                        }

                    if isinstance(data, dict) and 'price' in data:
                        logger.info(f"Received structured price data for {crop_name}")
                        return {
                            'price': float(data.get('price', 0)),
                            'trend': data.get('trend', 'unknown'),
                            'last_updated': data.get('last_updated', datetime.now().strftime('%Y-%m-%d %H:%M')),
                            'source': 'api'
                        }
                    
                    logger.error("Invalid API response format")
                    raise ValueError(MANDI_API_ERROR)
                else:
                    logger.error(f"Mandi API error: {resp.status_code} - {resp.text}")
                    raise requests.exceptions.RequestException(MANDI_API_ERROR)
                    
            except requests.exceptions.Timeout:
                logger.error("Mandi API timeout")
                raise requests.exceptions.RequestException(MANDI_API_ERROR)
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Mandi API request error: {str(e)}")
                raise
                
        # Fallback simulated prices
        logger.info(f"Using simulated prices for {crop_name}")
        import random
        base_prices = {
            'rice': 2000,
            'wheat': 1800,
            'cotton': 5500,
            'sugarcane': 300,
            'maize': 1600,
            'pulses': 4000
        }
        
        if crop_name in base_prices:
            base = base_prices[crop_name]
            variation = random.uniform(-100, 100)
            simulated_data = {
                'price': round(base + variation, 2),
                'trend': 'increasing' if variation > 0 else 'decreasing',
                'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M'),
                'source': 'simulated'
            }
            logger.info(f"Generated simulated price data for {crop_name}")
            return simulated_data
            
        logger.error(f"No price data available for crop: {crop_name}")
        return None
        
    except Exception as e:
        logger.error(f"Error in get_mandi_prices: {str(e)}")
        return None

@chatbot.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').lower()
    
    # Initialize response
    response = ""
    
    # Weather related queries
    if 'weather' in user_message:
        city = next((word for word in user_message.split() if word not in ['weather', 'in', 'at', 'of', 'the', 'tell', 'me', 'about']), None)
        if city:
            weather_info = get_weather_info(city)
            if weather_info:
                response = (f"Weather in {city.capitalize()}:\n"
                          f"🌡️ Temperature: {weather_info['temperature']}°C\n"
                          f"💧 Humidity: {weather_info['humidity']}%\n"
                          f"🌤️ Condition: {weather_info['description']}\n\n"
                          f"Based on these conditions, here are some crop recommendations:")
                
                # Add crop recommendations based on weather
                temp = weather_info['temperature']
                humidity = weather_info['humidity']
                
                for crop, info in CROP_INFO.items():
                    temp_range = info['optimal_temperature'].replace('°C', '').split('-')
                    if float(temp_range[0]) <= temp <= float(temp_range[1]):
                        response += f"\n• {crop.capitalize()}: Suitable temperature conditions"
            else:
                response = f"Sorry, I couldn't fetch weather information for {city}"
        else:
            response = "Please specify a city for weather information"
    
    # Crop information queries
    elif any(crop in user_message for crop in CROP_INFO.keys()):
        for crop, info in CROP_INFO.items():
            if crop in user_message:
                response = (f"🌾 Information about {crop.capitalize()}:\n\n"
                          f"Seasons: {', '.join(info['seasons'])}\n"
                          f"Sowing Time: {info['sowing_time']}\n"
                          f"Harvesting Time: {info['harvesting_time']}\n"
                          f"Optimal Temperature: {info['optimal_temperature']}\n"
                          f"Water Requirement: {info['water_requirement']}\n"
                          f"Suitable Soil: {info['soil_type']}\n\n"
                          f"Description: {info['description']}")
                break
    
    # Season information queries
    elif any(season in user_message for season in SEASON_INFO.keys()):
        for season, info in SEASON_INFO.items():
            if season in user_message:
                response = (f"🗓️ Information about {season.capitalize()} season:\n\n"
                          f"Months: {info['months']}\n"
                          f"Rainfall: {info['rainfall']}\n"
                          f"Major Crops: {', '.join(info['major_crops'])}\n"
                          f"Description: {info['description']}")
                break
    
    # Mandi related queries
    elif 'mandi' in user_message or 'market' in user_message:
        # If user asks for price + crop, return prices
        if 'price' in user_message or 'rate' in user_message:
            crops = [crop for crop in CROP_INFO.keys() if crop in user_message]
            if crops:
                crop = crops[0]
                price_info = get_mandi_prices(crop)
                if price_info:
                    response = (f"💰 Market Price Information for {crop.capitalize()}:\n\n"
                                f"Current Price: ₹{price_info['price']}/quintal\n"
                                f"Trend: {price_info.get('trend', 'unknown')}\n"
                                f"Last Updated: {price_info.get('last_updated')}" )
                else:
                    response = f"Sorry, I couldn't fetch market prices for {crop}."
            else:
                response = "Please specify a crop name to check its market price (e.g., 'price of rice')."
        elif 'types' in user_message:
            response = "Types of Mandis:\n" + "\n".join(f"• {t}" for t in MANDI_INFO['types'])
        elif 'service' in user_message:
            response = "Services available at Mandis:\n" + "\n".join(f"• {s}" for s in MANDI_INFO['services'])
        elif 'document' in user_message:
            response = "Documents needed for Mandi trading:\n" + "\n".join(f"• {d}" for d in MANDI_INFO['documents_needed'])
        elif 'tip' in user_message or 'practice' in user_message:
            response = "Best practices for Mandi trading:\n" + "\n".join(f"• {p}" for p in MANDI_INFO['best_practices'])
        else:
            response = ("🏪 Mandi Information:\n\n"
                      "I can provide information about:\n"
                      "1. Types of mandis (ask 'what are mandi types?')\n"
                      "2. Available services (ask 'what services do mandis offer?')\n"
                      "3. Required documents (ask 'what documents do I need?')\n"
                      "4. Best practices (ask 'what are mandi best practices?')\n\n"
                      "You can also use our mandi-wise price feature to check current rates.")
    
    # General help
    else:
        response = ("I can help you with:\n\n"
                  "🌤️ Weather Information:\n"
                  "• Ask 'what's the weather in [city]?'\n\n"
                  "🌾 Crop Information:\n"
                  "• Ask about specific crops (e.g., 'tell me about wheat')\n"
                  "• Available crops: " + ", ".join(CROP_INFO.keys()) + "\n\n"
                  "🗓️ Seasonal Information:\n"
                  "• Ask about seasons (e.g., 'what crops grow in rabi season?')\n"
                  "• Seasons: kharif, rabi, zaid\n\n"
                  "🏪 Mandi Information:\n"
                  "• Ask about mandis (e.g., 'what documents do I need for mandi?')\n"
                  "• Topics: types, services, documents, best practices")
    
    chat_message = ChatMessage(user_message, response)
    return jsonify(chat_message.to_dict())