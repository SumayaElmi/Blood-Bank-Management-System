import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    // Waxay baareysaa labada magac ee ugu caansan ee session-ka laga helo
    const userData = sessionStorage.getItem("user") || sessionStorage.getItem("currentUser");

    if (userData) {
      try {
        const data = JSON.parse(userData);
        // Waxay hubineysaa token-ka si kasta oo loogu magac daray (token ama accessToken)
        const token = data.token || data.accessToken;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing user data from sessionStorage", e);
      }
    }

    console.log("REQUEST TOKEN:", config.headers.Authorization);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;