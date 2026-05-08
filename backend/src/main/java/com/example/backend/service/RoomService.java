package com.example.backend.service;

import com.example.backend.dto.request.booking.CreateRoomRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.Room;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    public ResponseEntity<?> createRoom(CreateRoomRequest request) {

        Hotel hotel = hotelRepository.findById(request.hotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = Room.builder()
                .hotel(hotel)
                .roomNumber(request.roomNumber())
                .roomType(request.roomType())
                .price(request.price())
                .occupancy(request.occupancy())
                .amenities(request.amenities())
                .coverImageUrl(request.coverImageUrl())
                .build();

        roomRepository.save(room);

        return ResponseEntity.ok(
                ApiResponse.ok("Room created successfully", room)
        );
    }

    public ResponseEntity<?> getHotelRooms(UUID hotelId) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Rooms fetched successfully",
                        roomRepository.findByHotelId(hotelId)
                )
        );
    }
}