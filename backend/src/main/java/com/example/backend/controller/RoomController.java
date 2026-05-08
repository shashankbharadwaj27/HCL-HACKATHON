package com.example.backend.controller;

import com.example.backend.dto.request.booking.CreateRoomRequest;
import com.example.backend.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createRoom(
            @Valid @RequestBody CreateRoomRequest request
    ) {

        return roomService.createRoom(request);
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<?> getHotelRooms(
            @PathVariable UUID hotelId
    ) {

        return roomService.getHotelRooms(hotelId);
    }
}