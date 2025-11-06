# crop_details_service.py

def get_crop_details(crop):
    """
    Returns detailed information about a specific crop.
    """

    info = {
        "wheat": "Needs cool climate, requires 450–650mm rainfall. Ideal soil: loamy.",
        "rice": "Requires standing water. Best in clay soil. Needs hot & humid climate.",
        "maize": "Grows in warm weather. Requires well-drained sandy loam soil.",
        "sugarcane": "Needs tropical climate. High water requirement."
    }

    return f"🌿 **{crop.capitalize()} details:**\n{info.get(crop.lower(), 'No detailed info available.')}"
