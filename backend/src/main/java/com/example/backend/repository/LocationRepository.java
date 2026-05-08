package com.example.backend.repository;

import com.example.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    boolean existsByCityAndStateAndCountry(String city, String state, String country);
}