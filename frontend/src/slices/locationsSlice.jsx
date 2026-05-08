import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

export const fetchLocations = createAsyncThunk('locations/fetchAll', async (_, { rejectWithValue }) => {
  const res = await fetch('/api/locations', { headers: authHeaders() })
  const json = await res.json()
  if (!res.ok) return rejectWithValue(json)
  return json
})

export const createLocation = createAsyncThunk('locations/create', async (data, { rejectWithValue }) => {
  const res = await fetch('/api/locations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) return rejectWithValue(json)
  return json
})

const locationSlice = createSlice({
  name: 'locations',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (s) => { s.loading = true })
      .addCase(fetchLocations.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.data || [] })
      .addCase(fetchLocations.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createLocation.fulfilled, (s, a) => { s.list.push(a.payload.data) })
  },
})

export default locationSlice.reducer