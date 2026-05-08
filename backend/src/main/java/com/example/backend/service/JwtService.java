package com.example.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtService {

    @Value("${app.jwt.secret}")       private String secret;
    @Value("${app.jwt.expiration-ms}") private long expirationMs;

    private static final String COOKIE = "jwt";

    public ResponseCookie createCookie(String email) {
        String token = Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key())
                .compact();

        return ResponseCookie.from(COOKIE, token)
                .httpOnly(true)
                .path("/")
                .maxAge(expirationMs / 1000)
                .sameSite("Strict")
                // .secure(true)  ← uncomment in production (HTTPS)
                .build();
    }

    public ResponseCookie clearCookie() {
        return ResponseCookie.from(COOKIE, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
    }

    public String getEmailFromRequest(HttpServletRequest req) {
        Cookie c = WebUtils.getCookie(req, COOKIE);
        if (c == null) return null;
        log.info("COOKIE ="  + c.getValue());
        try {
            String email = Jwts.parser().verifyWith(key()).build()
                    .parseSignedClaims(c.getValue()).getPayload().getSubject();
            log.info("Extracted email: " + email);
            return email;
        } catch (JwtException e) { return null; }
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
