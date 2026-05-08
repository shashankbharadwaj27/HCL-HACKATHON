import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const BASE = "/hotels";

// Fetch all hotels
export const fetchHotels = createAsyncThunk(
  "hotels/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(BASE);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch hotels");
    }
  }
);

// Fetch single hotel
export const fetchHotelById = createAsyncThunk(
  "hotels/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/${id}`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch hotel");
    }
  }
);

// Fetch hotels by owner
export const fetchOwnerHotels = createAsyncThunk(
  "hotels/fetchOwnerHotels",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/owner/my-hotels`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch owner hotels");
    }
  }
);

// Create hotel
export const createHotel = createAsyncThunk(
  "hotels/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(BASE, data);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create hotel");
    }
  }
);

// Update hotel
export const updateHotel = createAsyncThunk(
  "hotels/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${BASE}/${id}`, data);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update hotel");
    }
  }
);

// Delete hotel
export const deleteHotel = createAsyncThunk(
  "hotels/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`${BASE}/${id}`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete hotel");
    }
  }
);

const hotelsSlice = createSlice({
  name: "hotels",
  initialState: {
    list: [],
    currentHotel: null,
    ownerHotels: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all hotels
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Fetch hotel by ID
    builder
      .addCase(fetchHotelById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Fetch owner hotels
    builder
      .addCase(fetchOwnerHotels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOwnerHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ownerHotels = action.payload;
      })
      .addCase(fetchOwnerHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Create hotel
    builder
      .addCase(createHotel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ownerHotels.push(action.payload);
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Update hotel
    builder
      .addCase(updateHotel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.ownerHotels.findIndex((h) => h.id === action.payload.id);
        if (idx !== -1) state.ownerHotels[idx] = action.payload;
        if (state.currentHotel?.id === action.payload.id) state.currentHotel = action.payload;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Delete hotel
    builder
      .addCase(deleteHotel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ownerHotels = state.ownerHotels.filter((h) => h.id !== action.payload);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentHotel } = hotelsSlice.actions;
export default hotelsSlice.reducer;
