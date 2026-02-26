import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type RawMaterial from "../../models/RawMaterial";
import { getAllRawMaterials } from "../../services/services";

interface RawMaterialState {
    items: RawMaterial[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RawMaterialState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchRawMaterials = createAsyncThunk(
    'rawMaterials/fetchRawMaterials',
    async () => {
        const response = await getAllRawMaterials();
        return response;
    }
);

const rawMaterialSlice = createSlice({
    name: 'rawMaterials',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRawMaterials.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRawMaterials.fulfilled, (state, action: PayloadAction<RawMaterial[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchRawMaterials.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Error find raw materials';
            });
    },
})
export default rawMaterialSlice.reducer;