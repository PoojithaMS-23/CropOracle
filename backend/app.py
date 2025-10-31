from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.farmer_routes import farmer_bp
from routes.price_prediction import price_prediction_bp  # <-- import new route
from routes.farmer_history_routes import farmer_history_bp  # ✅ new import
from routes.live_status import live_status_bp
from routes.confirm_to_route import confirm_to_route


app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(farmer_bp, url_prefix="/api")
app.register_blueprint(price_prediction_bp, url_prefix="/api")  # <-- register new blueprint
app.register_blueprint(farmer_history_bp, url_prefix="/api")  # ✅ register new blueprint
app.register_blueprint(live_status_bp, url_prefix="/api")
app.register_blueprint(confirm_to_route)


if __name__ == "__main__":
    app.run(debug=True)
