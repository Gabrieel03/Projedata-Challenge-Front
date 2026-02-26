import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import rawMaterialReducer from './slices/rawMaterialSlice';
import recipeReducer from './slices/productRawMaterial';

export const store = configureStore({
    reducer: {
        products : productReducer,
        rawMaterial: rawMaterialReducer,
        recipes: recipeReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch