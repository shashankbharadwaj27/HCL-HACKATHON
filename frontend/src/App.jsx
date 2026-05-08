import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from './slices/authSlice'

import Navbar from './components/Navbar'
import { Toast, ModalManager } from './components/Overlays'
import { ProtectedRoute } from './components/ProtectedRoute'

import Home from './pages/Homepage'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import HotelDetail from './pages/HotelDetailsPage'
import MyBookings from './pages/MyBookings'
import MyHotels from './pages/MyHotels'
import CreateHotel from './pages/CreateHotel'
import AddRoom from './pages/AddRoom'

function AppInit() {
  const dispatch = useDispatch()
  const { token, initialized } = useSelector((s) => s.auth)

  useEffect(() => {
    if (token && !initialized) {
      dispatch(fetchMe())
    } else if (!token) {
      dispatch({ type: 'auth/setInitialized' })
    }
  }, [token, initialized, dispatch])

  if (!initialized) {
    return (
      <div className="page-loader">
        <div className="spinner" style={{ width: 36, height: 36 }} />
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Loading…</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes */}
        <Route path="/" element={
          <ProtectedRoute requiredRole="ROLE_CUSTOMER">
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/hotels/:hotelId" element={
          <ProtectedRoute requiredRole="ROLE_CUSTOMER">
            <HotelDetail />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute requiredRole="ROLE_CUSTOMER">
            <MyBookings />
          </ProtectedRoute>
        } />

        {/* Owner routes */}
        <Route path="/my-hotels" element={
          <ProtectedRoute requiredRole="ROLE_OWNER">
            <MyHotels />
          </ProtectedRoute>
        } />
        <Route path="/create-hotel" element={
          <ProtectedRoute requiredRole="ROLE_OWNER">
            <CreateHotel />
          </ProtectedRoute>
        } />
        <Route path="/add-room/:hotelId" element={
          <ProtectedRoute requiredRole="ROLE_OWNER">
            <AddRoom />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="page-loader" style={{ flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}>Page not found</h2>
            <a href="/" className="btn btn-primary">Back to Home</a>
          </div>
        } />
      </Routes>
      <Toast />
      <ModalManager />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
    </BrowserRouter>
  )
}