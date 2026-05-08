import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../slices/authSlice'
import { showToast } from '../slices/uiSlice'
import './Navbar.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((s) => s.auth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
    dispatch(showToast({ message: 'Signed out successfully', type: 'success' }))
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">StayLux</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Explore</Link>
          {user && (
            <>
              {user.role === 'CUSTOMER' && (
                <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings')}`} onClick={() => setMenuOpen(false)}>My Stays</Link>
              )}
              {user.role === 'OWNER' && (
                <>
                  <Link to="/my-hotels" className={`nav-link ${isActive('/my-hotels')}`} onClick={() => setMenuOpen(false)}>My Hotels</Link>
                  <Link to="/create-hotel" className={`nav-link ${isActive('/create-hotel')}`} onClick={() => setMenuOpen(false)}>Add Hotel</Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-name">{user.name}</div>
                    <div className="dropdown-email">{user.email}</div>
                    <span className={`badge badge-gold`}>{user.role}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>Profile</Link>
                  {user.role === 'CUSTOMER' && (
                    <Link to="/my-bookings" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Bookings</Link>
                  )}
                  {user.role === 'OWNER' && (
                    <Link to="/my-hotels" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Hotels</Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  )
}