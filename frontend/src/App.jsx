import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/authSlice";
import { GuestRoute, PrivateRoute } from "./components/RouteGuards";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const dispatch = useDispatch();

  // Hydrate auth state on app load — checks the httpOnly JWT cookie
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — redirect to /home if already authenticated */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected routes — redirect to /login if not authenticated */}
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}