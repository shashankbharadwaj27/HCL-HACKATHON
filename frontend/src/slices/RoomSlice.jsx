import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const getToken = () => localStorage.getItem('token')
const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

export const fetchHotelRooms = createAsyncThunk('rooms/fetchByHotel', async (hotelId, { rejectWithValue }) => {
  const res = await fetch(`/api/rooms/hotel/${hotelId}`, { headers: authHeaders() })
  const json = await res.json()
  if (!res.ok) return rejectWithValue(json)
  return json
})

export const createRoom = createAsyncThunk('rooms/create', async (data, { rejectWithValue }) => {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) return rejectWithValue(json)
  return json
})

const roomSlice = createSlice({
  name: 'rooms',
  initialState: { list: [], loading: false, error: null },
  reducers: { clearRooms: (s) => { s.list = [] } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelRooms.pending, (s) => { s.loading = true })
      .addCase(fetchHotelRooms.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.data || [] })
      .addCase(fetchHotelRooms.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createRoom.pending, (s) => { s.loading = true; s.error = null })
      .addCase(createRoom.fulfilled, (s, a) => { s.loading = false; s.list.push(a.payload.data) })
      .addCase(createRoom.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearRooms } = roomSlice.actions
export default roomSlice.reducer