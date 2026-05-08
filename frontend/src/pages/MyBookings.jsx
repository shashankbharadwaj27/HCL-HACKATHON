import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyBookings } from '../slices/bookingsSlice'
import './MyBookings.css'

const STATUS_MAP = {
  PENDING: { label: 'Pending', cls: 'badge-gold' },
  CONFIRMED: { label: 'Confirmed', cls: 'badge-green' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-red' },
  COMPLETED: { label: 'Completed', cls: 'badge-gray' },
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyBookings() {
  const dispatch = useDispatch()
  const { list: bookings, loading } = useSelector((s) => s.bookings)

  useEffect(() => {
    dispatch(fetchMyBookings())
  }, [dispatch])

  const nights = (ci, co) => {
    if (!ci || !co) return 0
    return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000))
  }

  return (
    <main className="my-bookings-page">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="eyebrow">Your Reservations</div>
            <h2>My Stays</h2>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏖</div>
            <h3>No bookings yet</h3>
            <p>Start exploring hotels and make your first reservation</p>
            <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Explore Hotels</a>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => {
              const n = nights(b.checkInDate, b.checkoutDate)
              const status = STATUS_MAP[b.status] || STATUS_MAP.PENDING
              return (
                <div key={b.id} className="booking-item card">
                  <div className="bi-header">
                    <div className="bi-hotel">
                      <div className="bi-hotel-name">{b.room?.hotel?.name || 'Hotel'}</div>
                      <div className="bi-room">
                        <span className={`badge ${status.cls}`}>{status.label}</span>
                        <span className="bi-room-info">{b.room?.roomType} · Room {b.room?.roomNumber}</span>
                      </div>
                    </div>
                    <div className="bi-total">
                      <div className="bi-total-amount">${b.totalAmount || b.totalPrice || '—'}</div>
                      <div className="bi-total-label">{n} night{n !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <hr className="divider" />
                  <div className="bi-details">
                    <div className="bi-detail">
                      <div className="bi-detail-label">Check-in</div>
                      <div className="bi-detail-value">{formatDate(b.checkInDate)}</div>
                    </div>
                    <div className="bi-detail-sep">→</div>
                    <div className="bi-detail">
                      <div className="bi-detail-label">Check-out</div>
                      <div className="bi-detail-value">{formatDate(b.checkoutDate)}</div>
                    </div>
                    <div className="bi-detail">
                      <div className="bi-detail-label">Guests</div>
                      <div className="bi-detail-value">{b.totalGuests}</div>
                    </div>
                    <div className="bi-detail">
                      <div className="bi-detail-label">Booked on</div>
                      <div className="bi-detail-value">{formatDate(b.createdAt)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}