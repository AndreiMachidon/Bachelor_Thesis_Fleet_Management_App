package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.entities.CountryFuelPrices;
import com.fleetcore.fleetcorebackend.services.FuelPricesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/fuel")
public class FuelPricesController {

    @Autowired
    private FuelPricesService fuelPricesService;

    @GetMapping("/prices")
    public List<CountryFuelPrices> getAll(){
        return fuelPricesService.getAllCountryElectricityPrices();
    }
}
