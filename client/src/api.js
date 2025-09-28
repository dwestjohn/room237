// src/api.js
import axios from "axios";

// Base API URL – fallback to empty string for relative paths in dev
const API_URL = process.env.REACT_APP_API_URL || "";

// Axios instance with baseURL set
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // adjust if you later use cookies/sessions
});

export default api;
