import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOwnerHotels } from '../slices/hotelsSlice'
import './MyHotels.css'

export default function MyHotels() {
  const dispatch = useDispatch()
  const { ownerHotels: hotels, loading } = useSelector((s) => s.hotels)

  useEffect(() => {
    dispatch(fetchOwnerHotels())
  }, [dispatch])

  return (
    <main className="my-hotels-page">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="eyebrow">Your Properties</div>
            <h2>My Hotels</h2>
          </div>
          <Link to="/create-hotel" className="btn btn-primary">+ Add Hotel</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }} />
          </div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏨</div>
            <h3>No hotels yet</h3>
            <p>Add your first property to start receiving bookings</p>
            <Link to="/create-hotel" className="btn btn-gold" style={{ marginTop: '1.5rem' }}>
              Add Your First Hotel
            </Link>
          </div>
        ) : (
          <div className="owner-hotels-grid">
            {hotels.map((h) => (
              <div key={h.id} className="owner-hotel-card card">
                <div className="ohc-image">
                  <img
                    src={h.coverImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop'}
                    alt={h.name}
                  />
                </div>
                <div className="ohc-body">
                  <div className="ohc-location">
                    {h.location ? `${h.location.city}, ${h.location.country}` : 'Location TBD'}
                  </div>
                  <h3 className="ohc-name">{h.name}</h3>
                  {h.description && <p className="ohc-desc">{h.description}</p>}
                  <div className="ohc-actions">
                    <Link to={`/hotels/${h.id}`} className="btn btn-outline btn-sm">View Hotel</Link>
                    <Link to={`/add-room/${h.id}`} className="btn btn-primary btn-sm">Add Room</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}