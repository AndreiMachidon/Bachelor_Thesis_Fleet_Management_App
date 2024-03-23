package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.CountryFuelPrices;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CountryFuelPricesRepository extends JpaRepository<CountryFuelPrices, Long> {

    List<CountryFuelPrices> getAllByCountry(String country);
}
