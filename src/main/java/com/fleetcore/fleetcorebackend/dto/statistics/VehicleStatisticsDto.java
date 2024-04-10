package com.fleetcore.fleetcorebackend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VehicleStatisticsDto {
    private long numberOfBreakdowns;
    private long numberOfAccidents;
    private long numberOfMaintenances;
    private long numberOfCompletedRoutes;

    public void addBreakdown() {
        this.numberOfBreakdowns++;
    }

    public void addAccident() {
        this.numberOfAccidents++;
    }

    public void addMaintenance() {
        this.numberOfMaintenances++;
    }

    public void addRoute() {
        this.numberOfCompletedRoutes++;
    }
}
