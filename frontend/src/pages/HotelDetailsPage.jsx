import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHotelById, clearSelected } from '../slices/hotelsSlice'
import { fetchHotelRooms } from '../slices/roomSlice'
import { openModal } from '../slices/uiSlice'
import './HotelDetail.css'

const ROOM_IMAGES = {
  SINGLE: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop',
  DOUBLE: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&auto=format&fit=crop',
  SUITE: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&auto=format&fit=crop',
  DELUXE: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop',
}

export default function HotelDetail() {
  const { hotelId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { selected: hotel, loading: hotelLoading } = useSelector((s) => s.hotels)
  const { list: rooms, loading: roomsLoading } = useSelector((s) => s.rooms)
  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    dispatch(fetchHotelById(hotelId))
    if (user) dispatch(fetchHotelRooms(hotelId))
    return () => dispatch(clearSelected())
  }, [hotelId, dispatch, user])

  const handleBook = (room) => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'CUSTOMER') return
    dispatch(openModal({ type: 'booking', data: room }))
  }

  if (hotelLoading || !hotel) {
    return (
      <div className="page-loader">
        <div className="spinner" style={{ width: 36, height: 36 }} />
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Loading hotel…</p>
      </div>
    )
  }

  const location = hotel.location
    ? `${hotel.location.city}, ${hotel.location.state}, ${hotel.location.country}`
    : ''

  return (
    <main className="hotel-detail">
      {/* Cover */}
      <div className="hd-cover">
        <img
          src={hotel.coverImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&fit=crop'}
          alt={hotel.name}
        />
        <div className="hd-cover-overlay" />
        <div className="hd-cover-content container">
          <button className="hd-back btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
          <div>
            {location && <div className="hd-location">{location}</div>}
            <h1 className="hd-title">{hotel.name}</h1>
          </div>
        </div>
      </div>

      <div className="container hd-body">
        <div className="hd-info">
          {hotel.description && <p className="hd-desc">{hotel.description}</p>}
          {hotel.amenities && (
            <div className="hd-amenities">
              <div className="hd-label">Amenities</div>
              <div className="hd-amenities-list">
                {hotel.amenities.split(',').map((a, i) => (
                  <span key={i} className="badge badge-gray">{a.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="hd-rooms">
          <div className="section-header">
            <div>
              <div className="eyebrow">Available Accommodation</div>
              <h2>Our Rooms</h2>
            </div>
          </div>

          {!user ? (
            <div className="empty-state">
              <div className="icon">🔒</div>
              <h3>Sign in to view rooms</h3>
              <p>Create an account to browse available rooms and make a reservation.</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn btn-outline" onClick={() => navigate('/register')}>Register</button>
              </div>
            </div>
          ) : roomsLoading ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[1,2,3].map(i => <div key={i} className="room-skeleton" />)}
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🛏</div>
              <h3>No rooms available</h3>
              <p>Check back soon for availability</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-card card">
                  <div className="rc-image">
                    <img src={room.coverImageUrl || ROOM_IMAGES[room.roomType] || ROOM_IMAGES.DOUBLE} alt={room.roomType} />
                    <span className="rc-type badge badge-gold">{room.roomType}</span>
                  </div>
                  <div className="rc-body">
                    <div className="rc-top">
                      <div>
                        <div className="rc-num">Room {room.roomNumber}</div>
                        <div className="rc-occupancy">Up to {room.occupancy} guest{room.occupancy !== 1 ? 's' : ''}</div>
                      </div>
                      <div className="rc-price">
                        <span className="rc-amount">${room.price}</span>
                        <span className="rc-unit">/night</span>
                      </div>
                    </div>
                    {room.amenities && (
                      <p className="rc-amenities">{room.amenities}</p>
                    )}
                    {user.role === 'CUSTOMER' ? (
                      <button className="btn btn-gold btn-sm" style={{ width: '100%', marginTop: '1rem' }} onClick={() => handleBook(room)}>
                        Reserve Now
                      </button>
                    ) : (
                      <div className="rc-owner-note">Owner view</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}