package com.fleetcore.fleetcorebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteDto {
    private Long id;
    private double distance;
    private Date startTime;
    private Date arrivalTime;
    private double fuelCost;
    private double driverCost;
    private String encodedPolyline;
    private String routeStatus;
    private long adminId;
    private long vehicleId;
    private long driverId;
    private List<WaypointDto> waypoints;
}
