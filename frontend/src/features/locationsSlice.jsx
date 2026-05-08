import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const BASE = "/locations";

// Fetch all locations
export const fetchLocations = createAsyncThunk(
  "locations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(BASE);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch locations");
    }
  }
);

// Search hotels by location
export const searchHotelsByLocation = createAsyncThunk(
  "locations/searchHotels",
  async (locationId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/${locationId}/hotels`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to search hotels");
    }
  }
);

const locationsSlice = createSlice({
  name: "locations",
  initialState: {
    list: [],
    searchResults: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch all locations
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Search hotels by location
    builder
      .addCase(searchHotelsByLocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchHotelsByLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchHotelsByLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSearchResults } = locationsSlice.actions;
export default locationsSlice.reducer;
