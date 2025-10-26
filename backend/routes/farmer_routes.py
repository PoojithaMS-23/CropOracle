from flask import Blueprint, request, jsonify
from models.farmer_model import create_farmer, farmer_exists
from models.farmer_model import update_farmer

farmer_bp = Blueprint('farmer', __name__)

@farmer_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    name = data.get("name")
    username = data.get("username")
    password = data.get("password")
    location = data.get("location")
    age = data.get("age")
    phone = data.get("phone")

    # Validate required fields
    if not all([name, username, password, location, age, phone]):
        return jsonify({"message": "All fields are required"}), 400

    if farmer_exists(username):
        return jsonify({"message": "Username already exists"}), 409

    try:
        create_farmer(name, username, password, location, age, phone)
        return jsonify({"message": "Signup successful"}), 201
    except Exception as e:
        print("Error during signup:", e)
        return jsonify({"message": "Database error"}), 500




farmer_bp = Blueprint('farmer', __name__)

@farmer_bp.route('/update_profile/<int:farmer_id>', methods=['PUT'])
def update_profile(farmer_id):
    data = request.get_json()
    try:
        update_farmer(
            farmer_id,
            data.get("name"),
            data.get("username"),
            data.get("password"),
            data.get("location"),
            data.get("age"),
            data.get("phone")
        )
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        print("Error updating profile:", e)
        return jsonify({"message": "Database error"}), 500
