package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.entities.CountryElectricityPrice;
import com.fleetcore.fleetcorebackend.services.ElectricityPricesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/electricity")
public class ElectricityPricesController {

    @Autowired
    private ElectricityPricesService electricityPricesService;

    @GetMapping("/prices")
    public List<CountryElectricityPrice> getAll(){
        return electricityPricesService.getAllCountryElectricityPrices();
    }
}
