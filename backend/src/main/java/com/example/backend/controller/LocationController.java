package com.example.backend.controller;

import com.example.backend.dto.request.booking.CreateLocationRequest;
import com.example.backend.entity.Location;
import com.example.backend.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<?> addLocation(
            @Valid @RequestBody CreateLocationRequest request
    ) {
        return locationService.addLocation(request);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getLocations() {
        return locationService.getLocations();
    }
}