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

export const createProduct = async (productData: { name: string; price: number }) => {
    try {
        const response = await api.post("/products", productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

export const updateProduct = async (id: number, productData: { name: string; price: number }) => {
    try {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export const deleteProduct = async (id: number) => {
    try {
        await api.delete(`/products/${id}`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

export const getProductById = async (id: number) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}
