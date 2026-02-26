import { createSlice, createAsyncThunk, type PayloadAction, } from '@reduxjs/toolkit';
import type ProductRawMaterial from '../../models/ProductRawMaterial';
import { getAllRecipes } from '../../services/services';

interface RecipeState {
    items: ProductRawMaterial[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RecipeState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async () => {
        const response = await getAllRecipes();
        return response;
    }
);

const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<ProductRawMaterial[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Erro ao buscar as receitas';
            });
    },
});

export default recipeSlice.reducer;