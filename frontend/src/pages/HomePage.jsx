import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHotels } from '../slices/hotelsSlice'
import { fetchLocations } from '../slices/locationsSlice'
import HotelCard from '../components/HotelCard'
import SearchBar from '../components/SearchBar'
import './Home.css'

export default function Home() {
  const dispatch = useDispatch()
  const { list: hotels, loading, filters } = useSelector((s) => s.hotels)

  console.log('Hotels in HomePage:', hotels) // Debug log
  useEffect(() => {
    dispatch(fetchHotels())
    dispatch(fetchLocations())
  }, [dispatch])

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      const q = filters.search.toLowerCase()
      if (q && !h.name.toLowerCase().includes(q) &&
          !h.description?.toLowerCase().includes(q) &&
          !h.location?.city?.toLowerCase().includes(q)) return false
      if (filters.locationId && h.location?.id !== filters.locationId) return false
      return true
    })
  }, [hotels, filters])

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-eyebrow">Curated Hospitality</div>
          <h1 className="hero-title">
            Where every stay<br />
            <em>becomes a memory</em>
          </h1>
          <p className="hero-sub">
            Discover exceptional hotels handpicked for those who value the art of travel.
          </p>
        </div>
      </section>

      {/* Search + Hotels */}
      <section className="hotels-section">
        <div className="container">
          <SearchBar />

          <div className="section-header">
            <div>
              <div className="eyebrow">Our Collection</div>
              <h2>{filtered.length} {filtered.length === 1 ? 'Property' : 'Properties'}</h2>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid grid-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🏨</div>
              <h3>No hotels found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map((h) => <HotelCard key={h.id} hotel={h} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}