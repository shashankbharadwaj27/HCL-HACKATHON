package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record CreateBookingRequest(

        @NotNull(message = "Room ID is required")
        UUID roomId,

        @NotNull(message = "Check-in date is required")
        LocalDate checkInDate,

        @NotNull(message = "Checkout date is required")
        LocalDate checkoutDate,

        @NotNull(message = "Total guests is required")
        Integer totalGuests

) {
}