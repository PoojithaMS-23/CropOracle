from joblib import load
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # path to models folder

# Load models (pointing to correct .pkl files)
yield_model = load(os.path.join(BASE_DIR, "yield_model.pkl"))
price_model = load(os.path.join(BASE_DIR, "price_model.pkl"))

# Load encoded column structure
yield_columns = load(os.path.join(BASE_DIR, "yield_columns.pkl"))
price_columns = load(os.path.join(BASE_DIR, "price_columns.pkl"))

def predict_yield_and_price(data: dict):
    df = pd.DataFrame([data])

    categorical_cols = ["Location", "Soil_type", "Irrigation", "Crops", "Season"]
    df = pd.get_dummies(df, columns=categorical_cols)

    # Yield prediction
    df_yield = df.reindex(columns=yield_columns, fill_value=0)
    predicted_yield = yield_model.predict(df_yield)[0]

    # Price prediction
    df["predicted_yield"] = predicted_yield
    df_price = df.reindex(columns=price_columns, fill_value=0)
    predicted_price = price_model.predict(df_price)[0]

    return predicted_yield, predicted_price
