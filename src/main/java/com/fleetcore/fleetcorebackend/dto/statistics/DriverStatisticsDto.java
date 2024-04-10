package com.fleetcore.fleetcorebackend.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DriverStatisticsDto {
    private long numberOfAccidents;
    private long numberOfCompletedRoutes;
    private double totalEarnings;

    public void addEarnings(Double value) {
        this.totalEarnings += value;
    }

    public void addAccidents(long number) {
        this.numberOfAccidents += number;
    }

}
