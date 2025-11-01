import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
});

export const predictStress = (data) => API.post("/predict", data);
