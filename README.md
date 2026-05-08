# 🏨 StayLux — Hotel Booking Application

A full-stack hotel booking platform built with **Spring Boot** and **React**, enabling customers to discover and book hotels while giving hotel owners tools to manage their properties.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

---

## Overview

StayLux is a role-based hotel booking application with two distinct user types:

- **Customers** — browse hotels, view rooms, and make reservations
- **Owners** — list properties, manage rooms, and track bookings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Redux Toolkit, React Router, Axios |
| Backend | Spring Boot 3.x, Spring Security, Spring Data JPA |
| Database | MySQL |
| Authentication | JWT + HTTP-only Cookies |
| Validation | Jakarta Bean Validation |
| Logging | SLF4J + Logback |
| Email | Spring Mail (JavaMailSender) |
| Build Tool | Maven |

---

## Features

### Authentication
- User registration and login (Customer & Owner roles)
- Cookie-based session management
- Protected routes with role-based access control
- Email verification on registration
- Password reset via email

### Customer
- Browse and search hotels by name, location, and price
- View hotel details and available rooms
- Create and manage bookings
- View booking history and payment status

### Owner
- Create and manage hotel listings
- Add and update rooms with pricing
- View bookings for their properties

### Platform
- Global exception handling with meaningful error messages
- Paginated and filterable API responses
- Audit logging for key operations
- Email notifications for bookings, confirmations, and cancellations

---

## Database Schema

```
USER
├── id (UUID, PK)
├── name, email, password, phone
├── role: CUSTOMER | OWNER
└── createdAt, updatedAt

LOCATION
├── id (UUID, PK)
└── city, state, country

HOTEL
├── id (UUID, PK)
├── owner_id → USER
├── location_id → LOCATION
├── name, description, amenities (JSON)
├── rating, is_active
└── cover_image_url

ROOM
├── id (UUID, PK)
├── hotel_id → HOTEL
├── room_number, room_type: SINGLE | DOUBLE | SUITE | DELUXE
├── price, occupancy, amenities (JSON)
└── cover_image_url

BOOKING
├── id (UUID, PK)
├── user_id → USER
├── room_id → ROOM
├── check_in_date, checkout_date
├── total_guests, total_price
├── booking_status: PENDING | CONFIRMED | CANCELLED
└── payment_status: PENDING | PAID | REFUNDED
```

---

## Project Structure

```
staylux/
├── backend/
│   └── src/main/java/com/example/backend/
│       ├── controller/        # REST controllers
│       ├── service/           # Business logic
│       ├── repository/        # JPA repositories
│       ├── entity/            # JPA entities
│       ├── dto/               # Request/Response DTOs
│       ├── exception/         # Global exception handler
│       ├── security/          # JWT & Spring Security config
│       └── config/            # App configuration
│
└── frontend/
    └── src/
        ├── api/               # Axios instance
        ├── components/        # Shared UI components
        ├── pages/             # Route-level pages
        ├── slices/            # Redux Toolkit slices
        └── store.js           # Redux store
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL server
- Maven 3.8+

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/shashankbharadwaj27/HCL-HACKATHON.git
cd HCL-HACKATHON/backend

# Configure environment variables (see below)
cp src/main/resources/application.example.properties src/main/resources/application.properties

# Run the application
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd HCL-HACKATHON/frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and get session | Public |
| POST | `/auth/logout` | Invalidate session | Authenticated |
| GET | `/auth/me` | Get current user | Authenticated |

### Hotels
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/hotels` | List all active hotels | Authenticated |
| GET | `/hotels/:id` | Get hotel details | Authenticated |
| GET | `/hotels/owner` | Get owner's hotels | Owner |
| POST | `/hotels` | Create a hotel | Owner |
| PUT | `/hotels/:id` | Update a hotel | Owner |
| DELETE | `/hotels/:id` | Delete a hotel | Owner |

### Rooms
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/hotels/:id/rooms` | Get rooms for a hotel | Authenticated |
| POST | `/hotels/:id/rooms` | Add a room | Owner |
| PUT | `/rooms/:id` | Update a room | Owner |
| DELETE | `/rooms/:id` | Delete a room | Owner |

### Bookings
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/bookings` | Get user's bookings | Customer |
| POST | `/bookings` | Create a booking | Customer |
| PUT | `/bookings/:id/cancel` | Cancel a booking | Customer |

---

## Environment Variables

### Backend — `application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/staylux
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

app.frontend.url=http://localhost:5173
```

### Frontend — `.env`

```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Roadmap

- [x] Database schema design
- [x] JPA entities and relationships
- [x] Authentication (register, login, session)
- [x] Hotel and room management APIs
- [x] React frontend with Redux state management
- [x] Role-based protected routes
- [ ] Booking creation and management UI
- [x] Email notification service
- [ ] Payment integration
- [x] API documentation (Swagger/OpenAPI)
- [x] Unit and integration tests
- [ ] Docker configuration
- [ ] CI/CD pipeline

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request against `develop`

---

## License

This project is licensed under the MIT License.
