package com.fleetcore.fleetcorebackend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DashboardFuelCostsByTypeDto {
    private double electricityCosts;
    private double gasolineCosts;
    private double dieselCosts;

    public void addElectricityCosts(double value) {
        this.electricityCosts += value;
    }

    public void addGasolineCosts(double value) {
        this.gasolineCosts += value;
    }

    public void addDieselCosts(double value){
        this.dieselCosts += value;
    }

}
