package com.fleetcore.fleetcorebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DriverLocationDto {
    private Long routeId;
    private Long driverId;
    private double latitude;
    private double longitude;
}

