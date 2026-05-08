package com.example.backend.controller;

import com.example.backend.dto.request.booking.CreateHotelRequest;
import com.example.backend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_OWNER')")
    public ResponseEntity<?> createHotel(
            @Valid @RequestBody CreateHotelRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        log.info("Username: {}", user.getUsername());
        log.info("Authorities: {}", user.getAuthorities());
        return hotelService.createHotel(request, user.getUsername());
    }

    @GetMapping
    public ResponseEntity<?> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<?> getHotelById(@PathVariable UUID hotelId) {
        return hotelService.getHotelById(hotelId);
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getOwnerHotels(
            @AuthenticationPrincipal UserDetails user
    ) {
        return hotelService.getOwnerHotels(user.getUsername());
    }
}