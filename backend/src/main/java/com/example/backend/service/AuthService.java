package com.example.backend.service;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.request.auth.LoginRequest;
import com.example.backend.dto.request.auth.RegisterRequest;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public ResponseEntity<?> register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.email()))
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already in use"));

        userRepo.save(User.builder()
                .name(req.name())
                .email(req.email())
                .password(encoder.encode(req.password()))
                .roles(Set.of(Role.ROLE_USER))
                .build());

        return ResponseEntity.ok(ApiResponse.ok("Registered successfully"));
    }

    public ResponseEntity<?> login(LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials"));
        }

        var user   = userRepo.findByEmail(req.email()).orElseThrow();
        var cookie = jwt.createCookie(user.getEmail());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok("Login successful",Map.of(
                        "id",       user.getId(),
                        "name", user.getName(),
                        "email",    user.getEmail(),
                        "roles",    user.getRoles()
                )));
    }

    public ResponseEntity<?> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwt.clearCookie().toString())
                .body(ApiResponse.ok("Logged out"));
    }

    public ResponseEntity<?> me(String email) {
        return userRepo.findByEmail(email)
                .map(u -> ResponseEntity.ok(ApiResponse.ok("User fetched", Map.of(
                        "id",    u.getId(),
                        "name",  u.getName(),
                        "email", u.getEmail(),
                        "roles", u.getRoles()))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found")));
    }
}
