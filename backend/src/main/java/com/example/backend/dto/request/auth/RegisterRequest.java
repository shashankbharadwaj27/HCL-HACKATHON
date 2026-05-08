package com.example.backend.dto.request.auth;

import com.example.backend.entity.UserRole;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

public record RegisterRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 30, message = "Name must be between 3 and 30 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email address")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(
                regexp = "^[+]?[0-9]{10,15}$",
                message = "Phone number must be between 10 and 15 digits, optionally starting with +"
        )
        String phone,

        @NotNull(message = "Role is required")
        UserRole role,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        String password
) {}