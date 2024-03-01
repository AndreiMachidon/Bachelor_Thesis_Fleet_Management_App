package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.CountryElectricityPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CountryElectricityPriceRepository extends JpaRepository<CountryElectricityPrice, Long> {

    List<CountryElectricityPrice> getAllByCountryIs(String country);
}
