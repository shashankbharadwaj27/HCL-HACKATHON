import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const BASE = "/bookings";

// Fetch user bookings
export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/my-bookings`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

// Fetch owner bookings
export const fetchOwnerBookings = createAsyncThunk(
  "bookings/fetchOwnerBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/owner/pending-bookings`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch owner bookings");
    }
  }
);

// Create booking
export const createBooking = createAsyncThunk(
  "bookings/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(BASE, data);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create booking");
    }
  }
);

// Confirm booking
export const confirmBooking = createAsyncThunk(
  "bookings/confirm",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await api.put(`${BASE}/${bookingId}/confirm`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to confirm booking");
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await api.put(`${BASE}/${bookingId}/cancel`);
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel booking");
    }
  }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  "bookings/updatePayment",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${BASE}/${bookingId}/payment`, { paymentStatus: status });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update payment");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    userBookings: [],
    ownerBookings: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user bookings
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Fetch owner bookings
    builder
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ownerBookings = action.payload;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userBookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Confirm booking
    builder
      .addCase(confirmBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.ownerBookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.ownerBookings[idx] = action.payload;
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.userBookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.userBookings[idx] = action.payload;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Update payment status
    builder
      .addCase(updatePaymentStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        let idx = state.ownerBookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.ownerBookings[idx] = action.payload;
        idx = state.userBookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.userBookings[idx] = action.payload;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
