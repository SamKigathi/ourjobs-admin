
import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
    // Retrieve the token from local storage
    const token = JSON.parse(localStorage.getItem("auth"));
    // Check if the header property exists
    if (request.headers) {
        // Set the Authorization header if it exists
        request.headers["Authorization"] = `Bearer ${token}`;
    } else {
        // Create the headers property if it does not exist
        request.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return request;
});

export default axiosInstance;