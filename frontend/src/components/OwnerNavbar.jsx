import { useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function OwnerNavbar({ activeTab, onTabChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-stone-900 border-b border-stone-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/owner-dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-sm flex items-center justify-center">
              <span className="text-stone-950 font-bold text-xs font-mono">HM</span>
            </div>
            <span className="text-stone-200 font-semibold tracking-widest text-xs uppercase">Hotel Manager</span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onTabChange("hotels")}
              className={`text-sm transition-colors ${activeTab === "hotels" ? "text-amber-400 font-semibold" : "text-stone-400 hover:text-stone-200"}`}>
              My Hotels
            </button>
            <button
              onClick={() => onTabChange("bookings")}
              className={`text-sm transition-colors ${activeTab === "bookings" ? "text-amber-400 font-semibold" : "text-stone-400 hover:text-stone-200"}`}>
              Bookings
            </button>
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
      </div>
    </nav>
  );
}
