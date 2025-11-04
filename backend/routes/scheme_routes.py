from flask import Blueprint, request, jsonify
from models.scheme_model import get_eligible_schemes, get_scheme_updates
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

scheme_routes = Blueprint('scheme_routes', __name__)

@scheme_routes.route('/schemes/eligible', methods=['POST'])
def get_eligible_schemes_route():
    """
    Get schemes eligible for a specific farmer based on their profile
    """
    try:
        farmer_profile = request.json
        if not farmer_profile:
            return jsonify({"error": "Farmer profile data required"}), 400

        logger.info(f"Fetching eligible schemes for farmer: {farmer_profile.get('id')}")
        schemes = get_eligible_schemes(farmer_profile)
        
        return jsonify({
            "schemes": [scheme.to_dict() for scheme in schemes],
            "count": len(schemes),
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    except Exception as e:
        logger.error(f"Error fetching eligible schemes: {str(e)}")
        return jsonify({"error": "Failed to fetch eligible schemes"}), 500

@scheme_routes.route('/schemes/updates', methods=['GET'])
def get_scheme_updates_route():
    """
    Get scheme updates since last check
    """
    try:
        # Parse last_check parameter, default to 24 hours ago if not provided
        last_check_str = request.args.get('last_check')
        if last_check_str:
            last_check = datetime.strptime(last_check_str, '%Y-%m-%d %H:%M:%S')
        else:
            last_check = datetime.now().replace(
                hour=0, minute=0, second=0, microsecond=0
            )

        logger.info(f"Fetching scheme updates since: {last_check}")
        updates = get_scheme_updates(last_check)
        
        return jsonify({
            "updates": [update.to_dict() for update in updates],
            "count": len(updates),
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    except Exception as e:
        logger.error(f"Error fetching scheme updates: {str(e)}")
        return jsonify({"error": "Failed to fetch scheme updates"}), 500

@scheme_routes.route('/schemes/categories', methods=['GET'])
def get_scheme_categories():
    """
    Get list of available scheme categories
    """
    categories = [
        "Direct Benefit Transfer",
        "Insurance",
        "Credit",
        "Infrastructure",
        "Market Support",
        "Input Subsidy",
        "Training and Support"
    ]
    return jsonify({"categories": categories})

@scheme_routes.route('/schemes/notify', methods=['POST'])
def create_scheme_notification():
    """
    Create a new scheme notification for specific farmers
    """
    try:
        data = request.json
        required_fields = ['scheme_id', 'farmer_ids', 'message']
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Here you would typically:
        # 1. Save notification to database
        # 2. Send push notification if enabled
        # 3. Send SMS if enabled
        # 4. Send email if enabled
        
        logger.info(f"Created notification for scheme {data['scheme_id']} "
                   f"targeting {len(data['farmer_ids'])} farmers")

        return jsonify({
            "message": "Notification created successfully",
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    except Exception as e:
        logger.error(f"Error creating scheme notification: {str(e)}")
        return jsonify({"error": "Failed to create notification"}), 500