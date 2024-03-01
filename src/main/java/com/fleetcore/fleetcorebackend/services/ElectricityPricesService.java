package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.entities.CountryElectricityPrice;
import com.fleetcore.fleetcorebackend.repository.CountryElectricityPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElectricityPricesService {

    @Autowired
    private CountryElectricityPriceRepository countryElectricityPriceRepository;

    public List<CountryElectricityPrice> getAllCountryElectricityPrices(){
        return countryElectricityPriceRepository.findAll();
    }
}
