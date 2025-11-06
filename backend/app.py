from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.farmer_routes import farmer_bp
from routes.price_prediction import price_prediction_bp
from routes.farmer_history_routes import farmer_history_bp
from routes.live_status import live_status_bp
from routes.confirm_to_route import confirm_to_route
from routes.predicted_routes import predict_bp
from chatbot import chatbot_bp
from dotenv import load_dotenv
from routes.cultivation_routes import cultivation_bp
from routes.mandi_routes import mandi_routes
from routes.finalconfirm import final_confirm_bp
from routes.mandi_comparision import mandi_comparison_bp


import os

load_dotenv()

print("OpenAI Key Loaded:", os.getenv("OPENAI_API_KEY") is not None)
print("Weather API Key Loaded:", os.getenv("OPENWEATHER_API_KEY") is not None)

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(farmer_bp, url_prefix="/api")
app.register_blueprint(price_prediction_bp, url_prefix="/api")
app.register_blueprint(farmer_history_bp, url_prefix="/api")
app.register_blueprint(live_status_bp, url_prefix="/api")
app.register_blueprint(confirm_to_route)
app.register_blueprint(chatbot_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(cultivation_bp, url_prefix="/api")
app.register_blueprint(mandi_routes, url_prefix="/api")
app.register_blueprint(final_confirm_bp, url_prefix="/api")
app.register_blueprint(mandi_comparison_bp, url_prefix="/api")


if __name__ == "__main__":
    app.run(debug=True)
