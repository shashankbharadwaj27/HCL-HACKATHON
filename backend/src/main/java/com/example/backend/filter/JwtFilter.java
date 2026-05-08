package com.example.backend.filter;

import com.example.backend.service.JwtService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwt;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        log.info("FILTER RUNNING");
        String email = jwt.getEmailFromRequest(req);
        log.info("EMAIL ="  + email);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var ud = userDetailsService.loadUserByUsername(email);
            log.info("USER LOADED = " + ud.getUsername());
            var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
            SecurityContextHolder.getContext().setAuthentication(auth);
            log.info("AUTHENTICATION SET");
        }
        chain.doFilter(req, res);
    }
}
