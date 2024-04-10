package com.fleetcore.fleetcorebackend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DashboardFleetExpensesByCategoryDto {
    private double vehicleMaintenancesCosts;
    private double fuelCosts;
    private double driversCosts;
    private double vehiclesBreakdownsCosts;
}
