package com.example.backend.service;

import com.example.backend.dto.request.booking.CreateHotelRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Hotel;
import com.example.backend.entity.Location;
import com.example.backend.entity.User;
import com.example.backend.repository.HotelRepository;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    public ResponseEntity<?> createHotel(
            CreateHotelRequest request,
            String email
    ) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Location location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Hotel hotel = Hotel.builder()
                .name(request.name())
                .description(request.description())
                .amenities(request.amenities())
                .coverImageUrl(request.coverImageUrl())
                .owner(owner)
                .location(location)
                .rating(0.0f)
                .isActive(true)
                .build();

        hotelRepository.save(hotel);

        return ResponseEntity.ok(
                ApiResponse.ok("Hotel created successfully", hotel)
        );
    }

    public ResponseEntity<?> getAllHotels() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Hotels fetched successfully",
                        hotelRepository.findByIsActiveTrue()
                )
        );
    }

    public ResponseEntity<?> getHotelById(java.util.UUID hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        return ResponseEntity.ok(
                ApiResponse.ok("Hotel fetched successfully", hotel)
        );
    }

    public ResponseEntity<?> getOwnerHotels(String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Owner hotels fetched successfully",
                        hotelRepository.findByOwnerId(owner.getId())
                )
        );
    }
}