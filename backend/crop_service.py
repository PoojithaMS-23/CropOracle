# crop_service.py

def get_crop_suggestion(location=None):
    """
    Suggest crops based on location (dummy logic).
    """

    suggestions = {
        "karnataka": ["Ragi", "Rice", "Sugarcane"],
        "andhra pradesh": ["Rice", "Groundnut", "Cotton"],
        "maharashtra": ["Cotton", "Soybean", "Sugarcane"],
        "punjab": ["Wheat", "Rice", "Maize"]
    }

    if location and location.lower() in suggestions:
        crops = suggestions[location.lower()]
        return f"✅ Best crops for **{location.capitalize()}**: {', '.join(crops)}"

    return "🌱 Please provide a valid location to suggest ideal crops."
