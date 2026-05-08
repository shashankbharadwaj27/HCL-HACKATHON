package com.example.backend.service;

import com.example.backend.dto.request.booking.CreateLocationRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Location;
import com.example.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public ResponseEntity<?> getLocations() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Locations fetched successfully",
                        locationRepository.findAll()
                )
        );
    }

    public ResponseEntity<?> addLocation(CreateLocationRequest request) {
        if (locationRepository.existsByCityAndStateAndCountry(
                request.city(), request.state(), request.country()))
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Location already exists"));

        Location saved = locationRepository.save(Location.builder()
                .city(request.city())
                .state(request.state())
                .country(request.country())
                .build());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Location added", saved));
    }
}