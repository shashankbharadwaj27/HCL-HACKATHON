import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings, cancelBooking } from "../features/bookingsSlice";
import Navbar from "../components/Navbar";

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const { userBookings, status } = useSelector((s) => s.bookings);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, cancelled

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const filteredBookings =
    filter === "all"
      ? userBookings
      : userBookings.filter((b) => b.bookingStatus === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-800/50";
      case "confirmed":
        return "bg-green-900/30 text-green-300 border-green-800/50";
      case "cancelled":
        return "bg-red-900/30 text-red-300 border-red-800/50";
      default:
        return "bg-stone-800 text-stone-300 border-stone-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-300";
      case "paid":
        return "bg-green-900/30 text-green-300";
      case "refunded":
        return "bg-blue-900/30 text-blue-300";
      default:
        return "bg-stone-800 text-stone-300";
    }
  };

  const handleCancel = (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(bookingId));
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-8">My Bookings</h1>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-8">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-amber-400 text-stone-950"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden hover:border-amber-400/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {booking.room?.hotel?.name || "Hotel"}
                      </h3>
                      <p className="text-stone-400 text-sm">
                        {booking.room?.hotel?.location?.city}, {booking.room?.hotel?.location?.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Booking details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-stone-800">
                    <div>
                      <p className="text-stone-500 text-xs mb-1 uppercase">Room type</p>
                      <p className="text-stone-100 font-semibold capitalize">{booking.room?.roomType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs mb-1 uppercase">Check-in</p>
                      <p className="text-stone-100 font-semibold">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs mb-1 uppercase">Check-out</p>
                      <p className="text-stone-100 font-semibold">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs mb-1 uppercase">Guests</p>
                      <p className="text-stone-100 font-semibold">{booking.totalGuests}</p>
                    </div>
                  </div>

                  {/* Price and action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-500 text-xs mb-1 uppercase">Total price</p>
                      <p className="text-2xl font-bold text-amber-400">
                        ${booking.totalPrice?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 rounded-lg text-sm font-semibold transition-colors">
                        View Details
                      </button>
                      {booking.bookingStatus === "pending" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 rounded-lg text-sm font-semibold transition-colors border border-red-800/50">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-stone-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-stone-400 text-lg mb-4">No bookings yet</p>
            <a href="/home" className="text-amber-400 hover:text-amber-300 font-semibold">
              Browse hotels and make a booking
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
