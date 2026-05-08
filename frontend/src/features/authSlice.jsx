import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const BASE = "/auth";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Attempting registration with data:", data);
      const res = await api.post(`${BASE}/register`, data);

      if (!res.data.success) {
        return rejectWithValue(res.data.message);
      }
      console.log(res);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Attempting login with data:", data);
      const res = await api.post(`${BASE}/login`, data);

      console.log(res);
      if (!res.data.success) {
        return rejectWithValue(res.data.message);
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// Fetch current user
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/me`);

      if (!res.data.success) {
        return rejectWithValue(res.data.message);
      }

      return res.data.data;
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue("unauthenticated");
      }

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(`${BASE}/logout`);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Logout failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    status: "idle",
    error: null,
    hydrated: false,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // Register
    builder
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s) => {
        s.status = "succeeded";
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });

    // Me
    builder
      .addCase(fetchMe.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "succeeded";
        s.hydrated = true;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.user = null;
        s.status = "idle";
        s.hydrated = true;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
        s.hydrated = true;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;