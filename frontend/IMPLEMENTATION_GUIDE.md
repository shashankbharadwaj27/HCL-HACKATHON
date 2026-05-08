# Hotel Management System - Frontend Implementation Guide

## 🎯 Project Overview

A full-stack hotel management system with React + Redux frontend and Spring Boot backend. The system supports two user roles:
- **Customers**: Browse, search, and book hotels
- **Owners**: Manage hotels and confirm bookings with payment status

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosInstance.js       # HTTP client configuration
│   ├── components/
│   │   ├── HotelCard.jsx          # Reusable hotel display component
│   │   ├── Navbar.jsx             # Customer navigation with search
│   │   ├── OwnerNavbar.jsx        # Owner navigation
│   │   └── RouteGuards.jsx        # Auth-based route protection
│   ├── features/
│   │   ├── authSlice.jsx          # Auth state management
│   │   ├── bookingsSlice.jsx      # Booking state management
│   │   ├── hotelsSlice.jsx        # Hotel state management
│   │   └── locationsSlice.jsx     # Location state management
│   ├── pages/
│   │   ├── LoginPage.jsx          # User login
│   │   ├── RegisterPage.jsx       # User registration
│   │   ├── HomePage.jsx           # Hotel listing & search
│   │   ├── HotelDetailsPage.jsx   # Hotel details & rooms
│   │   ├── BookingPage.jsx        # Booking form & summary
│   │   ├── ProfilePage.jsx        # User profile management
│   │   ├── MyBookingsPage.jsx     # User bookings list
│   │   └── OwnerDashboardPage.jsx # Owner management portal
│   ├── store/
│   │   └── store.js               # Redux store configuration
│   ├── App.jsx                    # Main app component & routing
│   └── index.css                  # Global styles
└── package.json
```

---

## 🔐 Authentication Flow

### Login Page
- Email validation (correct format required)
- Password visibility toggle
- JWT token received and stored in httpOnly cookie
- Auto-redirect to home after login
- Signup link for new users

### Register Page
- Form fields: Name, Email, Phone, Role, Password
- Password strength requirements:
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
- Role selection: Customer or Hotel Owner
- Phone number validation
- Auto-redirect to login after successful registration

### Route Guards
- `GuestRoute` - Only for unauthenticated users (login, register)
- `PrivateRoute` - For all authenticated users
- `OwnerRoute` - Only for hotel owners
- `CustomerRoute` - Only for customers (if needed)

---

## 🏨 Customer Features

### Home Page (`/home`)
**Navbar**
- Logo & branding
- Navigation: Home, Profile, My Bookings
- Location search dropdown
- Sign out button

**Content**
- Welcome greeting with user name
- Hotel listings (all hotels sorted by rating)
- Top-rated hotels section
- Location-based search functionality
- Hotel cards with:
  - Cover image
  - Name and location
  - Rating & reviews
  - Description (truncated)
  - Amenities (first 3 + count)
  - "View Details" button

### Hotel Details Page (`/hotel/:id`)
**Hotel Information**
- Full-size cover image
- Hotel name, location, rating
- Complete description
- All amenities displayed in grid

**Rooms Section**
- Room type (Single, Double, Suite)
- Room number and occupancy
- Price per night
- Room images
- "Book Now" button for each room

### Booking Page (`/booking/:roomId`)
**Left Section (Booking Form)**
- Guest information (pre-filled from profile)
  - Name (read-only)
  - Email (read-only)
- Room details display
- Booking dates (check-in & check-out)
- Guest count with occupancy validation
- Form validation with error messages

**Right Sidebar (Summary)**
- Room type
- Number of nights
- Number of guests
- Price per night
- Real-time total price calculation
- Benefits list

**Submission**
- Confirm Booking button
- Creates booking in backend
- Redirects to My Bookings page

### Profile Page (`/profile`)
**Profile Header**
- Avatar with initials
- Upload photo button
- Name and email
- Role and phone display

**Edit Section**
- Edit button toggles form
- Update name and phone
- Email cannot be changed
- Save/Cancel buttons

**Additional Sections**
- Account Settings (change password, 2FA, devices)
- Preferences (notifications, newsletter, marketing)
- Danger Zone (delete account)

### My Bookings Page (`/my-bookings`)
**Filter Tabs**
- All, Pending, Confirmed, Cancelled

**Booking Cards**
- Hotel name and location
- Booking status (color-coded badge)
- Payment status (color-coded badge)
- Check-in and check-out dates
- Number of guests
- Total price
- View Details button
- Cancel Booking button (if pending)

**Status Colors**
- Pending: Yellow
- Confirmed: Green
- Cancelled: Red
- Paid: Green
- Unpaid: Yellow

---

## 👨‍💼 Owner Features

### Owner Dashboard (`/owner-dashboard`)

**Navigation**
- My Hotels tab
- Bookings tab
- Sign out button

#### My Hotels Tab
**Features**
- Grid display of all owner's hotels
- Add Hotel button (creates new hotel)

**Hotel Cards**
- Cover image
- Hotel name
- Description
- Statistics:
  - Number of rooms
  - Current rating
- Edit button
- View Rooms button

#### Bookings Tab
**Features**
- List of pending and confirmed bookings
- Sort by status

**Booking Cards**
- Guest name and email
- Booking status badge (color-coded)
- Payment status badge
- Room type and number
- Check-in/Check-out dates
- Total price
- Actions:
  - Confirm Booking (if pending)
  - Mark as Paid (if payment pending)
  - View Details

---

## 🔄 Redux State Management

### Auth Slice (`authSlice.jsx`)
```
State:
- user: { id, name, email, phone, role, createdAt, updatedAt }
- status: 'idle' | 'loading' | 'succeeded' | 'failed'
- error: string | null
- hydrated: boolean

Thunks:
- registerUser(formData)
- loginUser(credentials)
- fetchMe()
- logoutUser()

Actions:
- clearError()
```

### Hotels Slice (`hotelsSlice.jsx`)
```
State:
- list: Hotel[]
- currentHotel: Hotel | null
- ownerHotels: Hotel[]
- status: 'idle' | 'loading' | 'succeeded' | 'failed'
- error: string | null

Thunks:
- fetchHotels()
- fetchHotelById(id)
- fetchOwnerHotels()
- createHotel(data)
- updateHotel({ id, data })
- deleteHotel(id)

Actions:
- clearError()
- clearCurrentHotel()
```

### Bookings Slice (`bookingsSlice.jsx`)
```
State:
- userBookings: Booking[]
- ownerBookings: Booking[]
- status: 'idle' | 'loading' | 'succeeded' | 'failed'
- error: string | null

Thunks:
- fetchUserBookings()
- fetchOwnerBookings()
- createBooking(data)
- confirmBooking(bookingId)
- cancelBooking(bookingId)
- updatePaymentStatus({ bookingId, status })

Actions:
- clearError()
```

### Locations Slice (`locationsSlice.jsx`)
```
State:
- list: Location[]
- searchResults: Hotel[]
- status: 'idle' | 'loading' | 'succeeded' | 'failed'
- error: string | null

Thunks:
- fetchLocations()
- searchHotelsByLocation(locationId)

Actions:
- clearError()
- clearSearchResults()
```

---

## 🎨 Design System

### Color Palette
- **Primary Background**: `stone-950` (#0c0a09)
- **Secondary Background**: `stone-900` (#1c1917)
- **Borders**: `stone-800` (#292524)
- **Primary Accent**: `amber-400` (#fbbf24)
- **Primary Text**: `stone-100` (#f5f5f4)
- **Secondary Text**: `stone-400` (#a8a29e)

### Component Styles
- **Cards**: `bg-stone-900 border border-stone-800 rounded-lg`
- **Buttons**: `bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-md py-3`
- **Inputs**: `bg-stone-800 border border-stone-700 text-stone-100 rounded-md px-4 py-3`
- **Status Badges**: Color-coded (green, yellow, red)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🔗 API Integration

### Expected Backend Endpoints

#### Authentication (`/api/auth`)
```
POST /auth/register
POST /auth/login
POST /auth/logout
GET /auth/me
```

#### Hotels (`/api/hotels`)
```
GET /hotels
GET /hotels/{id}
GET /hotels/owner/my-hotels
POST /hotels
PUT /hotels/{id}
DELETE /hotels/{id}
```

#### Bookings (`/api/bookings`)
```
GET /bookings/my-bookings
GET /bookings/owner/pending-bookings
POST /bookings
PUT /bookings/{id}/confirm
PUT /bookings/{id}/cancel
PUT /bookings/{id}/payment
```

#### Locations (`/api/locations`)
```
GET /locations
GET /locations/{id}/hotels
```

### Response Format Expected
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Handling
- Network errors: Show error message
- 401: Auto logout and redirect to login
- 400/422: Show validation errors
- 500: Show generic error message

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on `http://localhost:8080`

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Access at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Code Quality
```bash
npm run lint
```

---

## 📋 Key Implementation Details

### JWT Authentication
- Tokens stored in httpOnly cookies for security
- Auto-refresh on app load via `fetchMe()`
- Axios configured with `withCredentials: true`

### Form Validation
- Email regex: `/^\S+@\S+\.\S+$/`
- Phone regex: `/^[\d\-+\s()]{10,}$/`
- Password requirements checked in real-time
- Date validation (check-out > check-in)
- Occupancy validation

### Price Calculation
- Automatic calculation on date change
- Formula: `nights * pricePerNight`
- Minimum 1 night required

### Search Functionality
- Location-based hotel search
- Real-time sorting by rating
- Clear search button to reset

### Booking Status Flow
- Created: `pending`
- After confirmation: `confirmed`
- User can cancel if `pending`

### Payment Status Flow
- Initial: `pending`
- Owner marks as: `paid` or `refunded`

---

## 🐛 Known Limitations

- Profile photo upload UI present but backend implementation needed
- Change password page not yet created
- Two-factor authentication UI only
- Hotel management forms (add/edit) UI ready, backend needed
- Room management UI ready, backend needed
- Email notifications not integrated
- Payment gateway not integrated

---

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile**: Single column layouts, touch-friendly buttons
- **Tablet**: Two column layouts
- **Desktop**: Full grid layouts (3 columns)

---

## 🔒 Security Features

✅ CSRF protection via httpOnly cookies
✅ JWT-based authentication
✅ Route guards for role-based access
✅ Input validation on all forms
✅ Secure password storage (handled by backend)
✅ No sensitive data in Redux store history

---

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify backend is running and accessible
3. Check network tab in DevTools for API responses
4. Ensure all required environment variables are set

---

**Frontend is ready for backend integration!**
