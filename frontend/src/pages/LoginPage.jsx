import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../slices/authSlice'
import { showToast } from '../slices/uiSlice'
import './Auth.css'

export default function LoginPage() {
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
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'error' : ''} autoComplete="email" />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={errors.password ? 'error' : ''} autoComplete="current-password" />
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