package com.example.backend.service;

import com.example.backend.dto.request.booking.CreateBookingRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Booking;
import com.example.backend.entity.Room;
import com.example.backend.entity.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.RoomRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ResponseEntity<?> createBooking(CreateBookingRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // check availability
        boolean isBooked = bookingRepository.existsOverlappingBooking(
                request.roomId(),
                request.checkInDate(),
                request.checkoutDate()
        );

        if (isBooked)
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Room is not available for selected dates"));

        BigDecimal totalPrice = room.getPrice()
                .multiply(BigDecimal.valueOf(
                        ChronoUnit.DAYS.between(request.checkInDate(), request.checkoutDate())
                ));

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.checkInDate())
                .checkoutDate(request.checkoutDate())
                .totalGuests(request.totalGuests())
                .totalPrice(totalPrice)
                .bookingStatus(Booking.BookingStatus.CONFIRMED)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .build();

        bookingRepository.save(booking);

        // send confirmation email
        emailService.sendBookingConfirmation(
                user.getEmail(),
                user.getName(),
                room.getHotel().getName(),
                room.getRoomNumber(),
                request.checkInDate(),
                request.checkoutDate(),
                request.totalGuests(),
                totalPrice
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking confirmed", Map.of(
                        "bookingId", booking.getId(),
                        "totalPrice", totalPrice,
                        "status", booking.getBookingStatus()
                )));
    }

    public ResponseEntity<?> getUserBookings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Bookings fetched successfully",
                        bookingRepository.findByUserId(user.getId())
                )
        );
    }
}