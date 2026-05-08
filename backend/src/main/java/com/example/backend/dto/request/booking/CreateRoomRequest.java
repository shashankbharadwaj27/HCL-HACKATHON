package com.example.backend.dto.request.booking;

import com.example.backend.entity.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateRoomRequest(

        @NotNull(message = "Hotel ID is required")
        UUID hotelId,

        @NotBlank(message = "Room number is required")
        String roomNumber,

        @NotNull(message = "Room type is required")
        RoomType roomType,

        @NotNull(message = "Price is required")
        BigDecimal price,

        @NotNull(message = "Occupancy is required")
        Integer occupancy,

        String amenities,

        String coverImageUrl

) {
}
