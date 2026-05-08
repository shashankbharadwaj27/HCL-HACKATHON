package com.example.backend.controller;

import com.example.backend.dto.request.booking.CreateBookingRequest;
import com.example.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        return bookingService.createBooking(request, user.getUsername());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyBookings(
            @AuthenticationPrincipal UserDetails user
    ) {
        return bookingService.getUserBookings(user.getUsername());
    }
}