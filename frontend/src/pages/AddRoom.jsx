import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createRoom } from '../slices/roomSlice'
import { showToast } from '../slices/uiSlice'

const ROOM_TYPES = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'TWIN', 'FAMILY']

export default function AddRoom() {
  const { hotelId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.rooms)

  const [form, setForm] = useState({
    hotelId: hotelId || '',
    roomNumber: '',
    roomType: 'DOUBLE',
    price: '',
    occupancy: 2,
    amenities: '',
    coverImageUrl: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.roomNumber.trim()) e.roomNumber = 'Room number required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required'
    if (!form.occupancy || form.occupancy < 1) e.occupancy = 'Occupancy must be at least 1'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch(createRoom({ ...form, price: Number(form.price), occupancy: Number(form.occupancy) }))
    if (createRoom.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Room added successfully!', type: 'success' }))
      navigate('/my-hotels')
    }
  }

  return (
    <main style={{ padding: '3rem 0 5rem', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div className="eyebrow">Owner Dashboard</div>
            <h2>Add Room</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div style={{ maxWidth: 580 }}>
          <form onSubmit={handleSubmit} className="ch-form">
            <div className="form-section">
              <h4>Room Details</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field">
                  <label>Room Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 101"
                    value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                    className={errors.roomNumber ? 'error' : ''}
                  />
                  {errors.roomNumber && <span className="err-msg">{errors.roomNumber}</span>}
                </div>

                <div className="field">
                  <label>Room Type *</label>
                  <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
                    {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>Price per Night ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={errors.price ? 'error' : ''}
                  />
                  {errors.price && <span className="err-msg">{errors.price}</span>}
                </div>

                <div className="field">
                  <label>Max Occupancy *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.occupancy}
                    onChange={(e) => setForm({ ...form, occupancy: e.target.value })}
                    className={errors.occupancy ? 'error' : ''}
                  />
                  {errors.occupancy && <span className="err-msg">{errors.occupancy}</span>}
                </div>
              </div>

              <div className="field">
                <label>Amenities</label>
                <input
                  type="text"
                  placeholder="e.g. King Bed, Ocean View, Mini Bar"
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Room Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="auth-api-error">
                {error?.errors ? Object.values(error.errors).join(' · ') : error?.message || 'Failed to add room'}
              </div>
            )}

            <div className="ch-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Add Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}