import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/authSlice";
import { fetchLocations } from "./features/locationsSlice";
import { GuestRoute, PrivateRoute, OwnerRoute } from "./components/RouteGuards";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";

export default function App() {
  const dispatch = useDispatch();

  // Hydrate auth state and fetch locations on app load
  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — redirect to /home if already authenticated */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected customer routes */}
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/hotel/:id" element={<PrivateRoute><HotelDetailsPage /></PrivateRoute>} />
        <Route path="/booking/:roomId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />

        {/* Owner routes */}
        <Route path="/owner-dashboard" element={<OwnerRoute><OwnerDashboardPage /></OwnerRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}