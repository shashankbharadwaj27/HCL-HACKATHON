import { Link } from 'react-router-dom'
import './HotelCard.css'

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=600&auto=format&fit=crop',
]

function getPlaceholder(id) {
  if (!id) return PLACEHOLDERS[0]
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return PLACEHOLDERS[hash % PLACEHOLDERS.length]
}

export default function HotelCard({ hotel }) {
  const img = hotel.coverImageUrl || getPlaceholder(hotel.id)
  const location = hotel.location
    ? `${hotel.location.city}, ${hotel.location.country}`
    : 'Premium Location'

  return (
    <Link to={`/hotels/${hotel.id}`} className="hotel-card card">
      <div className="hc-image">
        <img src={img} alt={hotel.name} loading="lazy" />
        <div className="hc-overlay">
          <span className="hc-cta">View Rooms →</span>
        </div>
      </div>
      <div className="hc-body">
        <div className="hc-location">{location}</div>
        <h3 className="hc-name">{hotel.name}</h3>
        {hotel.amenities && (
          <p className="hc-amenities">{hotel.amenities}</p>
        )}
        {hotel.description && (
          <p className="hc-desc">{hotel.description}</p>
        )}
      </div>
    </Link>
  )
}