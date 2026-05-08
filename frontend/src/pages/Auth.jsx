import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../store/slices/authSlice'
import { showToast } from '../store/slices/uiSlice'
import './Auth.css'

export function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (token) navigate('/')
    return () => dispatch(clearError())
  }, [token, navigate, dispatch])

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Welcome back!', type: 'success' }))
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-art-inner">
          <div className="auth-quote">
            <blockquote>"The world is a book, and those who do not travel read only one page."</blockquote>
            <cite>— Saint Augustine</cite>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-inner">
          <Link to="/" className="auth-logo">
            <span style={{ color: 'var(--gold)' }}>◆</span> StayLux
          </Link>

          <div className="auth-heading">
            <div className="eyebrow">Welcome back</div>
            <h2>Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={errors.password ? 'error' : ''}
                autoComplete="current-password"
              />
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>

            {error && (
              <div className="auth-api-error">
                {error?.message || 'Invalid credentials. Please try again.'}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'CUSTOMER',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (token) navigate('/')
    return () => dispatch(clearError())
  }, [token, navigate, dispatch])

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 3) e.name = 'Name must be at least 3 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone || !/^[+]?[0-9]{10,15}$/.test(form.phone)) e.phone = 'Valid phone number required (10–15 digits)'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(form.password)) {
      e.password = 'Must contain uppercase, lowercase, and number'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch({ type: 'auth/register/pending' }) // placeholder
    const res = await dispatch(require('../store/slices/authSlice').register(form))
    if (require('../store/slices/authSlice').register.fulfilled.match(res)) {
      dispatch(showToast({ message: 'Account created! Welcome to StayLux.', type: 'success' }))
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-art register-art">
        <div className="auth-art-inner">
          <div className="auth-quote">
            <blockquote>"Travel is the only thing you buy that makes you richer."</blockquote>
            <cite>— Unknown</cite>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-inner">
          <Link to="/" className="auth-logo">
            <span style={{ color: 'var(--gold)' }}>◆</span> StayLux
          </Link>

          <div className="auth-heading">
            <div className="eyebrow">Get started</div>
            <h2>Create your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>

            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="err-msg">{errors.phone}</span>}
            </div>

            <div className="field">
              <label>I am a</label>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${form.role === 'CUSTOMER' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'CUSTOMER' })}
                >
                  <span>🧳</span> Guest
                </button>
                <button
                  type="button"
                  className={`role-btn ${form.role === 'OWNER' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'OWNER' })}
                >
                  <span>🏨</span> Hotel Owner
                </button>
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 8 chars, upper + lower + number"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>

            {error && (
              <div className="auth-api-error">
                {error?.errors ? Object.values(error.errors).join(' · ') : error?.message || 'Registration failed'}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}