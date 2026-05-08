import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/bookings', data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/bookings/my')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const bookingSlice = createSlice({
  name: 'bookings',

  initialState: {
    list: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearBookingState: (s) => {
      s.error = null
      s.success = false
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (s) => {
        s.loading = true
        s.error = null
        s.success = false
      })

      .addCase(createBooking.fulfilled, (s, a) => {
        s.loading = false
        s.success = true
        s.list.unshift(a.payload.data)
      })

      .addCase(createBooking.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(fetchMyBookings.pending, (s) => {
        s.loading = true
      })

      .addCase(fetchMyBookings.fulfilled, (s, a) => {
        s.loading = false
        s.list = a.payload.data || []
      })

      .addCase(fetchMyBookings.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })
  },
})

export const { clearBookingState } = bookingSlice.actions
export default bookingSlice.reducer