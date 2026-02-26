import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

export const getAllProducts = async () => {
    try {
        const response = await api.get("/products");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}