import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchHotels } from "../features/hotelsSlice";
// import { fetchLocations, searchHotelsByLocation, clearSearchResults } from "../features/locationsSlice";
import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list: hotels } = useSelector((s) => s.hotels);
  const { searchResults } = useSelector((s) => s.locations);
  const [displayedHotels, setDisplayedHotels] = useState([]);

  // useEffect(() => {
  //   dispatch(fetchHotels());
  //   dispatch(fetchLocations());
  // }, [dispatch]);

  useEffect(() => {
    // Show search results if available, otherwise show all hotels sorted by rating
    if (searchResults.length > 0) {
      // setDisplayedHotels(searchResults);
    } else {
      const sorted = [...hotels].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      // setDisplayedHotels(sorted);
    }
  }, [hotels, searchResults]);

  const handleSearchLocation = (locationId) => {
    // dispatch(searchHotelsByLocation(locationId));
  };

  const handleClearSearch = () => {
    // dispatch(clearSearchResults());
  };

  const topRatedHotels = [...hotels].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Navbar */}
      <Navbar onSearchLocation={handleSearchLocation} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome section */}
        <div className="mb-12">
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Welcome, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-stone-400 text-lg">Find and book your perfect hotel</p>
        </div>

        {/* Search results or featured section */}
        {searchResults.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <button
                onClick={handleClearSearch}
                className="text-stone-400 hover:text-stone-200 text-sm transition-colors">
                Clear Search
              </button>
            </div>
            {displayedHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
                <p className="text-stone-400">No hotels found in this location</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured/Nearby hotels section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Available Hotels</h2>
              {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedHotels.slice(0, 6).map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
                  <p className="text-stone-400">No hotels available</p>
                </div>
              )}
            </div>

            {/* Top-rated hotels section */}
            {topRatedHotels.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Top Rated Hotels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topRatedHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}