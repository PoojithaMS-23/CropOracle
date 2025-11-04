from flask import Blueprint, request, jsonify
from models.farmer_model import get_farmer_by_credentials, create_farmer, farmer_exists
from db_config import get_db_connection
import logging

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return handle_preflight()
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
            
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        if not get_db_connection():
            return jsonify({"message": "Database service is currently unavailable"}), 503

        farmer = get_farmer_by_credentials(username, password)
        if farmer:
            return jsonify({"message": "Login successful", "farmer": farmer}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"message": "An error occurred during login"}), 500

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return handle_preflight()
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        required_fields = ['name', 'username', 'password', 'location', 'age', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"message": f"{field} is required"}), 400

        if not get_db_connection():
            return jsonify({"message": "Database service is currently unavailable"}), 503

        if farmer_exists(data['username']):
            return jsonify({"message": "Username already exists"}), 409

        create_farmer(
            data['name'],
            data['username'],
            data['password'],
            data['location'],
            data['age'],
            data['phone']
        )
        return jsonify({"message": "Signup successful"}), 201
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({"message": "An error occurred during signup"}), 500

def handle_preflight():
    response = jsonify({"message": "Preflight request successful"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response, 200
