import axios from "axios";
import type Product from "../models/Product";
import type RawMaterial from "../models/RawMaterial";
import type ProductRawMaterial from "../models/ProductRawMaterial";
import type SimulationResponseDTO from "../models/SimulationResponseDTO";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

//Product 
export const getAllProducts = async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
};

export const createProduct = async (productData: Omit<Product, 'id'>) => {
    const response = await api.post<Product>("/products", productData);
    return response.data;
};

export const updateProduct = async (id: number, productData: Omit<Product, 'id'>) => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id: number) => {
    await api.delete(`/products/${id}`);
};

export const getProductById = async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
};

//Raw Material
export const getAllRawMaterials = async () => {
    const response = await api.get<RawMaterial[]>("/raw-materials");
    return response.data;
};

export const createRawMaterial = async (data: Omit<RawMaterial, 'id'>) => {
    const response = await api.post<RawMaterial>("/raw-materials", data);
    return response.data;
};

export const updateRawMaterial = async (id: number, data: Omit<RawMaterial, 'id'>) => {
    const response = await api.put<RawMaterial>(`/raw-materials/${id}`, data);
    return response.data;
};

export const deleteRawMaterial = async (id: number) => {
    await api.delete(`/raw-materials/${id}`);
};

//Product-raw-materials

export const getAllRecipes = async () => {
  const response = await api.get("/product-recipes");
  return response.data;
};

export const createRecipe = async (productId: number, rawMaterialId: number, quantityNeeded: number) => {
  const payload = {
    productId: productId,
    rawMaterialId: rawMaterialId,
    quantity: quantityNeeded
  };
  const response = await api.post("/product-recipes", payload);
  return response.data;
};

export const updateRecipe = async (id: number, productId: number, rawMaterialId: number, quantityNeeded: number) => {
  const payload = {
    productId: productId,
    rawMaterialId: rawMaterialId,
    quantity: quantityNeeded // O Java espera 'quantity'
  };
  const response = await api.put(`/product-recipes/${id}`, payload);
  return response.data;
};

export const deleteRecipe = async (id: number) => {
  await api.delete(`/product-recipes/${id}`);
};

export const simulateProduction = async () => {
    const response = await api.get<SimulationResponseDTO>("/simulation");
    return response.data;
};