// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// ✅ Login API
export const loginFarmer = (username, password) => {
  return API.post("/login", { username, password });
};

// ✅ Price Prediction API
export const predictPrice = (payload) => {
  return API.post("/predict_price", payload);
};

// ✅ Get Cultivations API
export const getCurrentCultivations = (farmerId) => {
  return API.get(`/get_current_cultivations/${farmerId}`);
};

// ✅ Demand API (POST)
export const getMarketDemand = (cultivation_id, crop) => {
  return API.get(`/market-demand?cultivation_id=${cultivation_id}&crop=${crop}`);
};
export const finalConfirm = (payload) => {
  return API.post("/final-confirm", payload);
};
export const predictPriceMultipleMandis = (payloadArray) => {
  return API.post("/predict_price_multiple", { mandis: payloadArray });
};

export const getAllMandis = () => API.get("/mandis");
// ✅ Get crop-wise yield for a mandi
export const getMandiCropData = (mandi) => {
  return API.get(`/mandi/${mandi}`);
};

// ✅ Get mandi-wise yield for a crop
export const getCropAllMandisData = (crop) => {
  return API.get(`/crop/${crop}`);
};

export const getCapacity = () => API.get("/capacity");
