from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from routes.chatbot_routes import chatbot
from routes.scheme_routes import scheme_routes
from routes.auth_routes import auth_bp
from db_config import get_db_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register routes
app.register_blueprint(chatbot, url_prefix="/api")
app.register_blueprint(scheme_routes, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Server is running"})


if __name__ == "__main__":
    app.run(debug=True)
