import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '../slices/hotelsSlice'
import './SearchBar.css'

export default function SearchBar() {
  const dispatch = useDispatch()
  const { filters } = useSelector((s) => s.hotels)
  const { list: locations } = useSelector((s) => s.locations)

  const handle = (key, val) => dispatch(setFilters({ [key]: val }))

  const hasFilters = filters.search || filters.locationId || filters.minPrice || filters.maxPrice

  return (
    <div className="search-bar">
      <div className="sb-main">
        <div className="sb-search">
          <svg className="sb-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search hotels..."
            value={filters.search}
            onChange={(e) => handle('search', e.target.value)}
          />
        </div>

        <div className="sb-divider" />

        <select
          value={filters.locationId}
          onChange={(e) => handle('locationId', e.target.value)}
          className="sb-select"
        >
          <option value="">All Destinations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city}, {loc.country}
            </option>
          ))}
        </select>

        <div className="sb-divider" />

        <div className="sb-price">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => handle('minPrice', e.target.value)}
            min="0"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => handle('maxPrice', e.target.value)}
            min="0"
          />
        </div>
      </div>

      {hasFilters && (
        <button className="sb-clear btn btn-ghost btn-sm" onClick={() => dispatch(clearFilters())}>
          Clear filters ✕
        </button>
      )}
    </div>
  )
}