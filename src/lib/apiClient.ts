import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // Required for cross-origin requests with cookies (HTTP-only cookies are sent automatically)
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug log to verify API URL
if (typeof window !== "undefined") {
  console.log("API URL configured:", apiClient.defaults.baseURL);
}

// Request interceptor: Cookies are sent automatically by browser with withCredentials: true
// HTTP-only cookies cannot be read by JavaScript, so we don't try to read them
apiClient.interceptors.request.use((config) => {
  // Cookies are automatically included by the browser when withCredentials is true
  // No need to manually add Authorization header for HTTP-only cookies

  // If FormData is being sent, remove Content-Type header to let axios set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Response: Handle 401, network errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user cookie (not token - that's HTTP-only and handled by backend)
      Cookies.remove("user");
      // Redirect to home with login modal trigger
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // Only redirect if not already on public routes
        if (!currentPath.startsWith("/offers") && currentPath !== "/") {
          window.location.href = "/?login=true";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
