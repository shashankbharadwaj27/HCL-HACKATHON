package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void sendBookingConfirmation(String toEmail, String guestName,
                                        String hotelName, String roomNumber,
                                        LocalDate checkIn, LocalDate checkOut,
                                        int totalGuests, BigDecimal totalPrice) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(from);
            mail.setTo(toEmail);
            mail.setSubject("Booking Confirmed — " + hotelName);
            mail.setText("""
                    Hi %s,
                    
                    Your booking has been confirmed!
                    
                    Hotel      : %s
                    Room       : %s
                    Check-in   : %s
                    Check-out  : %s
                    Guests     : %d
                    Total Price: ₹%.2f
                    
                    Thank you for booking with us.
                    """.formatted(guestName, hotelName, roomNumber,
                    checkIn, checkOut, totalGuests, totalPrice));

            mailSender.send(mail);
            log.info("Booking confirmation sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send confirmation email to {}: {}", toEmail, e.getMessage());
        }
    }
}