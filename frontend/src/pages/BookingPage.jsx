import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelById } from "../features/hotelsSlice";
import { createBooking } from "../features/bookingsSlice";
import Navbar from "../components/Navbar";

export default function BookingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useSelector((s) => s.auth);
  const { currentHotel, status: hotelStatus } = useSelector((s) => s.hotels);
  const { status: bookingStatus, error: bookingError } = useSelector((s) => s.bookings);

  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    totalGuests: 1,
    totalPrice: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentHotel?.rooms) {
      const foundRoom = currentHotel.rooms.find((r) => r.id === roomId);
      setRoom(foundRoom);
    }
  }, [currentHotel, roomId]);

  // Calculate total price when dates change
  useEffect(() => {
    if (form.checkInDate && form.checkOutDate && room) {
      const checkIn = new Date(form.checkInDate);
      const checkOut = new Date(form.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        const total = nights * room.price;
        setForm((f) => ({ ...f, totalPrice: total }));
      }
    }
  }, [form.checkInDate, form.checkOutDate, room]);

  const handle = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.checkInDate) errs.checkInDate = "Check-in date is required";
    if (!form.checkOutDate) errs.checkOutDate = "Check-out date is required";
    if (form.checkInDate && form.checkOutDate) {
      const checkIn = new Date(form.checkInDate);
      const checkOut = new Date(form.checkOutDate);
      if (checkOut <= checkIn) {
        errs.checkOutDate = "Check-out date must be after check-in date";
      }
    }
    if (!form.totalGuests || form.totalGuests < 1) {
      errs.totalGuests = "Number of guests must be at least 1";
    }
    if (room && form.totalGuests > room.occupancy) {
      errs.totalGuests = `Maximum occupancy is ${room.occupancy}`;
    }
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const bookingData = {
      roomId,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      totalGuests: parseInt(form.totalGuests),
      totalPrice: form.totalPrice,
      bookingStatus: "pending",
      paymentStatus: "pending",
    };

    const result = await dispatch(createBooking(bookingData));
    if (createBooking.fulfilled.match(result)) {
      navigate("/my-bookings");
    }
  };

  if (hotelStatus === "loading" || !room) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  const checkInDate = new Date(form.checkInDate);
  const checkOutDate = new Date(form.checkOutDate);
  const nights =
    form.checkInDate && form.checkOutDate
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-200 mb-8 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-semibold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking form */}
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="space-y-6">
              {bookingError && (
                <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {bookingError}
                </div>
              )}

              {/* Guest info - pre-filled */}
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Guest Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Full name</label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full bg-stone-800 border border-stone-700 text-stone-300 rounded-md px-4 py-3 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full bg-stone-800 border border-stone-700 text-stone-300 rounded-md px-4 py-3 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Room details */}
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Room Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Room Type</p>
                    <p className="text-stone-100 font-semibold capitalize">{room?.roomType} Room (Room #{room?.roomNumber})</p>
                  </div>
                  <div>
                    <p className="text-stone-400 text-sm mb-1">Price per night</p>
                    <p className="text-2xl font-bold text-amber-400">${room?.price?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              </div>

              {/* Booking dates */}
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Booking Dates</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Check-in date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={form.checkInDate}
                      onChange={handle}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full bg-stone-800 border ${
                        errors.checkInDate ? "border-red-600" : "border-stone-700"
                      } text-stone-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors`}
                    />
                    {errors.checkInDate && <p className="text-red-400 text-xs mt-1">{errors.checkInDate}</p>}
                  </div>

                  <div>
                    <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Check-out date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={form.checkOutDate}
                      onChange={handle}
                      required
                      min={form.checkInDate || new Date().toISOString().split("T")[0]}
                      className={`w-full bg-stone-800 border ${
                        errors.checkOutDate ? "border-red-600" : "border-stone-700"
                      } text-stone-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors`}
                    />
                    {errors.checkOutDate && <p className="text-red-400 text-xs mt-1">{errors.checkOutDate}</p>}
                  </div>

                  <div>
                    <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Number of guests</label>
                    <input
                      type="number"
                      name="totalGuests"
                      value={form.totalGuests}
                      onChange={handle}
                      min="1"
                      max={room?.occupancy}
                      required
                      className={`w-full bg-stone-800 border ${
                        errors.totalGuests ? "border-red-600" : "border-stone-700"
                      } text-stone-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors`}
                    />
                    <p className="text-stone-500 text-xs mt-1">Max capacity: {room?.occupancy} guests</p>
                    {errors.totalGuests && <p className="text-red-400 text-xs mt-1">{errors.totalGuests}</p>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingStatus === "loading" || nights <= 0}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold text-sm rounded-md py-3 transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2">
                {bookingStatus === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-700 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-stone-400">Room type</p>
                  <p className="text-stone-100 font-semibold capitalize">{room?.roomType}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-400">Nights</p>
                  <p className="text-stone-100 font-semibold">{nights}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-400">Guests</p>
                  <p className="text-stone-100 font-semibold">{form.totalGuests}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-400">Price per night</p>
                  <p className="text-stone-100 font-semibold">${room?.price?.toFixed(2) || "0.00"}</p>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-stone-300 font-semibold">Total price</p>
                  <p className="text-2xl font-bold text-amber-400">${form.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-stone-800 rounded-lg p-4 mt-4 text-xs text-stone-400">
                <p>✓ Secure payment</p>
                <p>✓ Free cancellation up to 24h before check-in</p>
                <p>✓ Instant confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
