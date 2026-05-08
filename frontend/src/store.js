import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hotelsReducer from "./slices/hotelsSlice";
import bookingsReducer from "./slices/bookingsSlice";
import locationsReducer from "./slices/locationsSlice";
import uiSlice from "./slices/UiSlice";
import roomSlice from "./slices/roomSlice";

export const store = configureStore({
  reducer: { 
    rooms:roomSlice,
    auth: authReducer,
    hotels: hotelsReducer,
    bookings: bookingsReducer,
    locations: locationsReducer,
    ui:uiSlice
  },
});