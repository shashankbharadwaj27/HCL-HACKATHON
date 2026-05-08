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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ResponseEntity<?> createBooking(
            CreateBookingRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        long totalDays = ChronoUnit.DAYS.between(
                request.checkInDate(),
                request.checkoutDate()
        );

        BigDecimal totalPrice = room.getPrice()
                .multiply(BigDecimal.valueOf(totalDays));

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.checkInDate())
                .checkoutDate(request.checkoutDate())
                .totalGuests(request.totalGuests())
                .totalPrice(totalPrice)
                .bookingStatus(Booking.BookingStatus.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .build();

        bookingRepository.save(booking);

        return ResponseEntity.ok(
                ApiResponse.ok("Booking created successfully", booking)
        );
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