import { message } from "antd";
import axios from "axios";

// Create Axios instance
const Instance = axios.create({
  baseURL: "http://localhost:4000", // Replace with your API URL

  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach Token)
Instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Fetch token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle Status Codes)
Instance.interceptors.response.use(
  (response) => {
    return response; // If the response is successful (200, 201)
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Handle Specific Status Codes
      switch (response.status) {
        case 400:
          console.error("Bad Request: ", response.data.message);
          message.error(response.data.message || "Bad request");
          break;

        case 401:
          console.error("Unauthorized: Token expired or invalid");
          // alert("Session expired. Redirecting to login...");
          localStorage.removeItem("token"); // Clear token
          window.location.href = "/"; // Redirect to login
          break;

        case 403:
          console.error("Forbidden: Access denied");
          // alert("You do not have permission to perform this action.");
          break;

        case 404:
          console.error("Not Found: ", response.data.message);
          // alert("Requested resource not found.");
          break;

        case 500:
          console.error("Server Error: ", response.data.message);
          // alert("Something went wrong. Please try again later.");
          break;

        default:
          console.error("Error: ", response.data.message);
          // alert(response.data.message || "An error occurred.");
      }
    } else {
      console.error("Network Error:", error);
      // alert("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default Instance;
