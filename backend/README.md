# CropOracle Backend - Chatbot & API Setup

## Overview
A sophisticated agricultural chatbot system that provides:
- Real-time weather information via OpenWeatherMap API
- Market prices (mandi rates) for various crops
- Crop and seasonal information
- Best practices for farmers

## Recent Updates
- Enhanced error handling and logging for API integrations
- Implemented real-time weather data via OpenWeatherMap
- Added support for external mandi price APIs
- Improved documentation and configuration management
- Added comprehensive logging system

## Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Node.js and npm (for frontend)
- OpenWeatherMap API key (get it from [OpenWeatherMap](https://openweathermap.org/api))

## Setup Instructions

### 1. Python Environment Setup
```bash
# Create a virtual environment (recommended)
python -m venv .venv

# Activate the virtual environment
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Windows Command Prompt:
.\.venv\Scripts\activate.bat
# On Unix/MacOS:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory with these settings:

```ini
# Required for real weather data (get from openweathermap.org)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional: External mandi prices API
MANDI_API_URL=https://your-mandi-api.example.com/price

# Optional: Configure logging
LOG_LEVEL=INFO
LOG_FILE=chatbot.log
```

Notes:
- Without `OPENWEATHER_API_KEY`, the system uses simulated weather data
- Without `MANDI_API_URL`, the system generates simulated market prices
- The chatbot works in demo mode if APIs are not configured

Run
1. Start backend (from the `backend` directory):

   python app.py

2. Start frontend (from the `frontend` directory):

   npm install
   npm start

API examples
- Chat endpoint (used by frontend): POST http://localhost:5000/api/chat
  Body: { "message": "What's the weather in Mysuru?" }

- Mandi price (if you have MANDI_API_URL set): the backend will call: MANDI_API_URL?crop=<crop>

Notes
- The chatbot will always work in demo-mode (simulated weather & prices) if API keys are not configured.
- If you want me to integrate a specific mandi-price provider, provide the API docs or an example URL and I will wire it in.
