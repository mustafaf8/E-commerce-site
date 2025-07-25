import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null,
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/search`, { params: { keyword } });
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Arama sonuçları alınamadı." }
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Arama sırasında bir hata oluştu.",
        }
      );
    }
  }
);

const searchSlice = createSlice({
  name: "shopSearch",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Arama başarısız oldu.";
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
