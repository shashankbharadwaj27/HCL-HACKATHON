import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchHotelById, clearCurrentHotel } from "../features/hotelsSlice";
import Navbar from "../components/Navbar";

export default function HotelDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentHotel, status } = useSelector((s) => s.hotels);

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(id));
    }
    return () => dispatch(clearCurrentHotel());
  }, [id, dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
            <p className="text-stone-400 mb-6">Hotel not found</p>
            <Link to="/home" className="text-amber-400 hover:text-amber-300">
              Back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-200 mb-8 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header with image */}
        <div className="mb-8">
          <div className="h-96 bg-stone-800 rounded-lg overflow-hidden mb-6">
            {currentHotel.coverImageUrl ? (
              <img
                src={currentHotel.coverImageUrl}
                alt={currentHotel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                </svg>
              </div>
            )}
          </div>

          {/* Hotel info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-semibold mb-2">{currentHotel.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-stone-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {currentHotel.location?.city}, {currentHotel.location?.state}, {currentHotel.location?.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-stone-300 font-semibold">{currentHotel.rating || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-stone-400 text-lg mb-8">{currentHotel.description}</p>
        </div>

        {/* Amenities */}
        {currentHotel.amenities && currentHotel.amenities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentHotel.amenities.map((amenity, idx) => (
                <div key={idx} className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-3">
                  <p className="text-stone-300">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rooms section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
          {currentHotel.rooms && currentHotel.rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentHotel.rooms.map((room) => (
                <div key={room.id} className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden hover:border-amber-400 transition-colors">
                  {/* Room image */}
                  <div className="h-48 bg-stone-800 overflow-hidden">
                    {room.coverImageUrl ? (
                      <img
                        src={room.coverImageUrl}
                        alt={`${room.roomType} Room`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Room info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-stone-100 font-semibold text-lg capitalize mb-1">
                        {room.roomType} Room
                      </h3>
                      <p className="text-stone-400 text-sm">
                        Room #{room.roomNumber} • Up to {room.occupancy} guests
                      </p>
                    </div>

                    {/* Price */}
                    <div className="bg-stone-800 rounded-lg px-3 py-2 mb-4">
                      <p className="text-stone-400 text-xs mb-1">Price per night</p>
                      <p className="text-2xl font-bold text-amber-400">
                        ${room.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>

                    {/* Book button */}
                    <Link
                      to={`/booking/${room.id}`}
                      className="block w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md py-2.5 text-center transition-all duration-150 active:scale-[0.98]">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-8 text-center">
              <p className="text-stone-400">No rooms available at this hotel</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
