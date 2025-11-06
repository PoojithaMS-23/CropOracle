# price_service.py

def get_price(crop, location=None):
    """
    Mock crop price prediction — replace with ML model later.
    """

    sample_prices = {
        "wheat": "₹2200 / quintal",
        "rice": "₹2000 / quintal",
        "maize": "₹1850 / quintal",
        "sugarcane": "₹340 / quintal"
    }

    price = sample_prices.get(crop.lower(), "Price data not available")

    if location:
        return f"📊 Estimated price of **{crop.capitalize()}** in **{location.capitalize()}** is **{price}**."
    else:
        return f"📊 Estimated price of **{crop.capitalize()}** is **{price}**."
