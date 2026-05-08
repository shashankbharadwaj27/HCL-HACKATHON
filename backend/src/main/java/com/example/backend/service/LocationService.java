package com.example.backend.service;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
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
}