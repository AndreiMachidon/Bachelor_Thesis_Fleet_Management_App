package com.fleetcore.fleetcorebackend.entities.routes.waypoints;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("FUEL_STATION")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FuelStationWaypoint extends Waypoint {

    private Double gasolinePrice;
    private Double dieselPrice;
}
