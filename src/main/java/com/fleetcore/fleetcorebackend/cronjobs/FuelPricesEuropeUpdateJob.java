package com.fleetcore.fleetcorebackend.cronjobs;

import com.fleetcore.fleetcorebackend.services.FuelPricesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class FuelPricesEuropeUpdateJob {

    @Autowired
    private FuelPricesService fuelPricesService;

    @Scheduled(fixedRate = 10000)
    public void updateFuelPrices(){
        
    }
}
