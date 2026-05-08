package com.example.backend.dto.request.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateHotelRequest(

        @NotBlank(message = "Hotel name is required")
        String name,

        String description,

        String amenities,

        String coverImageUrl,

        @NotNull(message = "Location is required")
        UUID locationId

) {
}