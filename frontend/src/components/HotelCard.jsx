import { Link } from "react-router-dom";

export default function HotelCard({ hotel, onBook }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden hover:border-amber-400 transition-colors">
      {/* Hotel image */}
      <div className="h-48 bg-stone-800 overflow-hidden">
        {hotel.coverImageUrl ? (
          <img
            src={hotel.coverImageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
          </div>
        )}
      </div>

      {/* Hotel info */}
      <div className="p-4">
        <Link to={`/hotel/${hotel.id}`}>
          <h3 className="text-stone-100 font-semibold text-lg mb-1 hover:text-amber-400 transition-colors">
            {hotel.name}
          </h3>
        </Link>

        {/* Location and rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-stone-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{hotel.location?.city}, {hotel.location?.state}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-stone-300 text-sm font-semibold">{hotel.rating || 0}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-stone-400 text-sm mb-4 line-clamp-2">
          {hotel.description || "No description available"}
        </p>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action button */}
        <Link
          to={`/hotel/${hotel.id}`}
          className="block w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md py-2.5 text-center transition-all duration-150 active:scale-[0.98]">
          View Details
        </Link>
      </div>
    </div>
  );
}
