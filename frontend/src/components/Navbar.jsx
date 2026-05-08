import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ onSearchLocation }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list: locations } = useSelector((s) => s.locations);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleSearch = () => {
    if (selectedLocation && onSearchLocation) {
      onSearchLocation(selectedLocation);
    }
  };

  return (
    <nav className="bg-stone-900 border-b border-stone-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-sm flex items-center justify-center">
              <span className="text-stone-950 font-bold text-xs font-mono">HM</span>
            </div>
            <span className="text-stone-200 font-semibold tracking-widest text-xs uppercase">Hotel Manager</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/home" className="text-stone-400 hover:text-stone-200 text-sm transition-colors">
              Home
            </Link>
            <Link to="/profile" className="text-stone-400 hover:text-stone-200 text-sm transition-colors">
              Profile
            </Link>
            <Link to="/my-bookings" className="text-stone-400 hover:text-stone-200 text-sm transition-colors">
              My Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="text-stone-400 hover:text-stone-200 text-sm transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 items-center">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 bg-stone-800 border border-stone-700 text-stone-100 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          >
            <option value="">Search by location...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.city}, {loc.state}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md px-6 py-2 transition-all duration-150 active:scale-[0.98]">
            Search
          </button>
        </div>
      </div>
    </nav>
  );
}
