package com.example.backend.dto.request.auth;

import jakarta.validation.constraints.*;
public record RegisterRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 30, message = "Name must be between 3 and 30 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        String password
) {}
