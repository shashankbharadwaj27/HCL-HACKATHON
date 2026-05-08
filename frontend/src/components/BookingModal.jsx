import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBooking, clearBookingState } from '../slices/bookingsSlice'
import { showToast } from '../slices/uiSlice'
import './BookingModal.css'

export default function BookingModal({ room, onClose }) {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((s) => s.bookings)

  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    checkInDate: today,
    checkoutDate: '',
    totalGuests: 1,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (success) {
      dispatch(showToast({ message: 'Booking confirmed! Enjoy your stay.', type: 'success' }))
      dispatch(clearBookingState())
      onClose()
    }
  }, [success, dispatch, onClose])

  useEffect(() => {
    return () => dispatch(clearBookingState())
  }, [dispatch])

  const validate = () => {
    const e = {}
    if (!form.checkInDate) e.checkInDate = 'Check-in date required'
    if (!form.checkoutDate) e.checkoutDate = 'Checkout date required'
    if (form.checkoutDate && form.checkInDate && form.checkoutDate <= form.checkInDate) {
      e.checkoutDate = 'Checkout must be after check-in'
    }
    if (!form.totalGuests || form.totalGuests < 1) e.totalGuests = 'At least 1 guest required'
    if (room?.occupancy && form.totalGuests > room.occupancy) {
      e.totalGuests = `Max occupancy: ${room.occupancy}`
    }
    return e
  }

  const nights = form.checkInDate && form.checkoutDate
    ? Math.max(0, Math.round((new Date(form.checkoutDate) - new Date(form.checkInDate)) / 86400000))
    : 0

  const total = nights * (room?.price || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    dispatch(createBooking({ roomId: room.id, ...form, totalGuests: Number(form.totalGuests) }))
  }

  return (
    <div className="booking-modal">
      <div className="bm-header">
        <div>
          <div className="bm-eyebrow">Reserve Your Stay</div>
          <h3>{room?.roomType} — Room {room?.roomNumber}</h3>
        </div>
        <button className="bm-close" onClick={onClose}>✕</button>
      </div>

      <div className="bm-room-info">
        <div className="bm-price">
          <span className="bm-price-amount">${room?.price}</span>
          <span className="bm-price-unit">/ night</span>
        </div>
        <div className="bm-amenities">{room?.amenities || 'Premium amenities included'}</div>
      </div>

      <hr className="divider" />

      <form onSubmit={handleSubmit} className="bm-form">
        <div className="bm-dates">
          <div className="field">
            <label>Check-In</label>
            <input
              type="date"
              min={today}
              value={form.checkInDate}
              onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
              className={errors.checkInDate ? 'error' : ''}
            />
            {errors.checkInDate && <span className="err-msg">{errors.checkInDate}</span>}
          </div>
          <div className="field">
            <label>Check-Out</label>
            <input
              type="date"
              min={form.checkInDate || today}
              value={form.checkoutDate}
              onChange={(e) => setForm({ ...form, checkoutDate: e.target.value })}
              className={errors.checkoutDate ? 'error' : ''}
            />
            {errors.checkoutDate && <span className="err-msg">{errors.checkoutDate}</span>}
          </div>
        </div>

        <div className="field">
          <label>Guests</label>
          <input
            type="number"
            min="1"
            max={room?.occupancy || 10}
            value={form.totalGuests}
            onChange={(e) => setForm({ ...form, totalGuests: e.target.value })}
            className={errors.totalGuests ? 'error' : ''}
          />
          {errors.totalGuests && <span className="err-msg">{errors.totalGuests}</span>}
        </div>

        {nights > 0 && (
          <div className="bm-summary">
            <div className="bm-summary-row">
              <span>${room?.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
              <span>${total?.toFixed(2)}</span>
            </div>
            <div className="bm-summary-row bm-total">
              <span>Total</span>
              <span>${total?.toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bm-error">
            {error?.message || 'Booking failed. Please try again.'}
          </div>
        )}

        <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Confirm Reservation'}
        </button>
      </form>
    </div>
  )
}