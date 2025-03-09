import axios from "axios";

export const apiClient=axios.create({
    baseURL:import.meta.env.VITE_SERVER_API_URL,
    withCredentials:true
})

