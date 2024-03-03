package com.fleetcore.fleetcorebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WaypointDto {
    private Long id;

    private String address;
    private Double latitude;
    private Double longitude;
    private String type;
    private Double gasolinePrice;
    private Double dieselPrice;
    private Double electricityPrice;

    private Map<String, Double> connectors;

    private Integer duration;
}
