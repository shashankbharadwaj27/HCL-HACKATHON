import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', data)

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', data)
      return res.data.data  // { id, name, email, roles }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// export const logout = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.post('/auth/logout')
//       return res.data.message;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message)
//     }
//   }
// )

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me')
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    user: null,
    initialized: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    setInitialized: (state) => { state.initialized = true },  // ✅ add this
    logout: (state) => {
      state.token = null
      state.user = null
      state.initialized = true
    },
  },
extraReducers: (builder) => {
  builder
    .addCase(login.pending, (state) => { state.loading = true; state.error = null })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload           // { id, name, email, roles }
      state.token = 'session'               // dummy truthy value since auth is cookie-based
      state.initialized = true
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    .addCase(fetchMe.pending, (state) => { state.loading = true })
    .addCase(fetchMe.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.token = 'session'               // same here
      state.initialized = true
    })
    .addCase(fetchMe.rejected, (state) => {
      state.loading = false
      state.token = null
      state.user = null
      state.initialized = true
    })

    .addCase(register.pending, (state) => { state.loading = true; state.error = null })
    .addCase(register.fulfilled, (state) => { state.loading = false })
    .addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
}
})

export const { setInitialized, logout, clearError } = authSlice.actions

export default authSlice.reducer