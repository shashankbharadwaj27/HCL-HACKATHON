import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// ✅ fetchHotels: removed bogus `res.ok` check (that's fetch API, not axios)
export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/hotels')
    return res.data.data
  } catch (error) {
    return rejectWithValue({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    })
  }
})

export const fetchHotelById = createAsyncThunk('hotels/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/hotels/${id}`)
    return res.data.data
  } catch (error) {
    return rejectWithValue({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    })
  }
})

// ✅ fetchOwnerHotels: was missing return
export const fetchOwnerHotels = createAsyncThunk('hotels/fetchOwner', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/hotels/owner')
    return res.data.data
  } catch (error) {
    return rejectWithValue({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    })
  }
})

// ✅ createHotel: removed res.json() and res.ok (axios doesn't use those)
export const createHotel = createAsyncThunk('hotels/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/hotels', data)
    return res.data.data
  } catch (error) {
    return rejectWithValue({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    })
  }
})

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    list: [],
    ownerHotels: [],
    selected: null,
    loading: false,
    error: null,
    filters: { search: '', locationId: '', minPrice: '', maxPrice: '' },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearFilters: (state) => { state.filters = { search: '', locationId: '', minPrice: '', maxPrice: '' } },
    clearSelected: (state) => { state.selected = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (s) => { s.loading = true; s.error = null })
      // ✅ payload is already res.data.data, no need for .data again
      .addCase(fetchHotels.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || [] })
      .addCase(fetchHotels.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchHotelById.pending, (s) => { s.loading = true; s.error = null })
      // ✅ same here, payload is already the hotel object
      .addCase(fetchHotelById.fulfilled, (s, a) => { s.loading = false; s.selected = a.payload })
      .addCase(fetchHotelById.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(fetchOwnerHotels.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchOwnerHotels.fulfilled, (s, a) => { s.loading = false; s.ownerHotels = a.payload || [] })
      .addCase(fetchOwnerHotels.rejected, (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(createHotel.pending, (s) => { s.loading = true; s.error = null })
      .addCase(createHotel.fulfilled, (s, a) => {
        s.loading = false
        s.ownerHotels.push(a.payload)
        s.list.push(a.payload)
      })
      .addCase(createHotel.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { setFilters, clearFilters, clearSelected } = hotelSlice.actions
export default hotelSlice.reducer