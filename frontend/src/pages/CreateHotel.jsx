import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createHotel } from '../slices/hotelsSlice'
import { fetchLocations } from '../slices/locationsSlice'
import { showToast } from '../slices/uiSlice'
import './CreateHotel.css'

export default function CreateHotel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.hotels)
  const { list: locations } = useSelector((s) => s.locations)

  const [form, setForm] = useState({
    name: '', description: '', amenities: '', coverImageUrl: '', locationId: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(fetchLocations())
  }, [dispatch])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Hotel name required'
    if (!form.locationId) e.locationId = 'Please select a location'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch(createHotel(form))
    if (createHotel.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Hotel created successfully!', type: 'success' }))
      navigate('/my-hotels')
    }
  }

  return (
    <main className="create-hotel-page">
      <div className="container">
        <div className="ch-header">
          <div>
            <div className="eyebrow">Owner Dashboard</div>
            <h2>Add New Hotel</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div className="ch-layout">
          <form onSubmit={handleSubmit} className="ch-form">
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="field">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  placeholder="e.g. The Grand Meridian"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="err-msg">{errors.name}</span>}
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your hotel, its history, atmosphere..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="field">
                <label>Location *</label>
                <select
                  value={form.locationId}
                  onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                  className={errors.locationId ? 'error' : ''}
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.city}, {loc.state}, {loc.country}
                    </option>
                  ))}
                </select>
                {errors.locationId && <span className="err-msg">{errors.locationId}</span>}
              </div>
            </div>

            <div className="form-section">
              <h4>Details & Media</h4>
              <div className="field">
                <label>Amenities</label>
                <input
                  type="text"
                  placeholder="e.g. Pool, Spa, Free WiFi, Restaurant"
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Separate with commas</span>
              </div>

              <div className="field">
                <label>Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                />
              </div>

              {form.coverImageUrl && (
                <div className="ch-preview">
                  <img src={form.coverImageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            {error && (
              <div className="auth-api-error">
                {error?.errors ? Object.values(error.errors).join(' · ') : error?.message || 'Failed to create hotel'}
              </div>
            )}

            <div className="ch-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Hotel'}
              </button>
            </div>
          </form>

          <div className="ch-tips">
            <h4>Tips for a great listing</h4>
            <ul>
              <li>Use a high-quality cover photo that showcases your hotel's best feature</li>
              <li>Write a compelling description that highlights what makes your property unique</li>
              <li>List all amenities — travelers filter by these</li>
              <li>After creating your hotel, add rooms with detailed information and pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}