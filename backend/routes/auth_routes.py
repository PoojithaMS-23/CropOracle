from flask import Blueprint, request, jsonify
from models.farmer_model import get_farmer_by_credentials

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    farmer = get_farmer_by_credentials(username, password)
    if farmer:
        return jsonify({"message": "Login successful", "farmer": farmer}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
