package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.entities.CountryFuelPrices;
import com.fleetcore.fleetcorebackend.repository.CountryFuelPricesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuelPricesService {

    @Autowired
    private CountryFuelPricesRepository countryFuelPricesRepository;

    public List<CountryFuelPrices> getAllCountryElectricityPrices(){
        return countryFuelPricesRepository.findAll();
    }
}
