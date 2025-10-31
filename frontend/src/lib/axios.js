import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
	timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json' // <--- ESTA LINHA É CRÍTICA!
    }
});

export default axiosInstance;
