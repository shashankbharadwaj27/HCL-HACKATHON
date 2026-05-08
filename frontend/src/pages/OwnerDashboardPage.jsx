import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnerHotels } from "../features/hotelsSlice";
import { fetchOwnerBookings, confirmBooking, updatePaymentStatus } from "../features/bookingsSlice";
import OwnerNavbar from "../components/OwnerNavbar";

export default function OwnerDashboardPage() {
  const dispatch = useDispatch();
  const { ownerHotels, status: hotelStatus } = useSelector((s) => s.hotels);
  const { ownerBookings, status: bookingStatus } = useSelector((s) => s.bookings);
  const [activeTab, setActiveTab] = useState("hotels");

  useEffect(() => {
    dispatch(fetchOwnerHotels());
    dispatch(fetchOwnerBookings());
  }, [dispatch]);

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

  const getBookingStatusColor = (status) => {
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

  const handleConfirmBooking = (bookingId) => {
    dispatch(confirmBooking(bookingId));
  };

  const handleMarkAsPaid = (bookingId) => {
    dispatch(updatePaymentStatus({ bookingId, status: "paid" }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <OwnerNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* My Hotels Tab */}
        {activeTab === "hotels" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-semibold">My Hotels</h1>
              <button className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md px-6 py-3 transition-all duration-150 active:scale-[0.98] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Hotel
              </button>
            </div>

            {hotelStatus === "loading" ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : ownerHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownerHotels.map((hotel) => (
                  <div key={hotel.id} className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden hover:border-amber-400 transition-colors">
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
                      <h3 className="text-stone-100 font-semibold text-lg mb-2">{hotel.name}</h3>
                      <p className="text-stone-400 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-stone-800 rounded-lg px-3 py-2">
                          <p className="text-stone-500 text-xs mb-1">Rooms</p>
                          <p className="text-stone-100 font-semibold">{hotel.rooms?.length || 0}</p>
                        </div>
                        <div className="bg-stone-800 rounded-lg px-3 py-2">
                          <p className="text-stone-500 text-xs mb-1">Rating</p>
                          <p className="text-stone-100 font-semibold">{hotel.rating || "0"}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-md py-2 transition-all duration-150 active:scale-[0.98]">
                          Edit
                        </button>
                        <button className="flex-1 border border-stone-700 hover:border-stone-600 text-stone-300 hover:text-stone-100 font-semibold text-xs rounded-md py-2 transition-colors">
                          View Rooms
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
                <p className="text-stone-400 text-lg mb-6">No hotels added yet</p>
                <button className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md px-6 py-3 transition-all duration-150 active:scale-[0.98]">
                  Add Your First Hotel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h1 className="text-3xl font-semibold mb-8">Booking Confirmations</h1>

            {bookingStatus === "loading" ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : ownerBookings.length > 0 ? (
              <div className="space-y-6">
                {ownerBookings.map((booking) => (
                  <div key={booking.id} className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            Booking for {booking.user?.name}
                          </h3>
                          <p className="text-stone-400 text-sm">{booking.user?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBookingStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Booking details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-stone-800">
                        <div>
                          <p className="text-stone-500 text-xs mb-1 uppercase">Room type</p>
                          <p className="text-stone-100 font-semibold capitalize">{booking.room?.roomType}</p>
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
                          <p className="text-stone-500 text-xs mb-1 uppercase">Total price</p>
                          <p className="text-stone-100 font-semibold">${booking.totalPrice?.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {booking.bookingStatus === "pending" && (
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md px-6 py-2.5 transition-colors">
                            Confirm Booking
                          </button>
                        )}
                        {booking.paymentStatus === "pending" && booking.bookingStatus !== "cancelled" && (
                          <button
                            onClick={() => handleMarkAsPaid(booking.id)}
                            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md px-6 py-2.5 transition-colors">
                            Mark as Paid
                          </button>
                        )}
                        <button className="border border-stone-700 hover:border-stone-600 text-stone-300 hover:text-stone-100 font-semibold text-sm rounded-md px-6 py-2.5 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
                <p className="text-stone-400 text-lg">No pending bookings</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
