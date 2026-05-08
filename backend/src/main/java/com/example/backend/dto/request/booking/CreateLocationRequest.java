package com.example.backend.dto.request.booking;

import jakarta.validation.constraints.NotBlank;

public record CreateLocationRequest (
    @NotBlank(message = "City is required")
    String city,

    @NotBlank(message = "State is required")
    String state,

    @NotBlank(message = "Country is required")
    String country
){}
