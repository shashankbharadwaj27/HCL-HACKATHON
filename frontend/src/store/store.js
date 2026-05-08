import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import hotelsReducer from "../features/hotelsSlice";
import bookingsReducer from "../features/bookingsSlice";
import locationsReducer from "../features/locationsSlice";

export const store = configureStore({
  reducer: { 
    auth: authReducer,
    hotels: hotelsReducer,
    bookings: bookingsReducer,
    locations: locationsReducer,
  },
});