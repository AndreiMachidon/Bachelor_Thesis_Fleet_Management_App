package com.fleetcore.fleetcorebackend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DashboardCardsInfoDto {

    private long totalVehicles;
    private long idleVehicles;
    private long onRouteVehicles;
    private long inServiceVehicles;
    private double totalDrivers;
    private double totalDistance;
    private double averageDriversRate;
    private long totalRoutes;
    private long upcomingRoutes;
    private long inProgressRoutes;
    private long completedRoutes;

    public void addIdleVehicle() {
        this.idleVehicles++;
    }

    public void addOnRouteVehicle() {
        this.onRouteVehicles++;
    }

    public void addInServiceVehicle() {
        this.inServiceVehicles++;
    }

    public void addUpcomingRoute() {
        this.upcomingRoutes++;
    }

    public void addInProgressRoute() {
        this.inProgressRoutes++;
    }

    public void addCompletedRoute() {
        this.completedRoutes++;
    }
}
