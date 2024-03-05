package com.fleetcore.fleetcorebackend.entities.routes.waypoints;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Entity
@DiscriminatorValue("ELECTRIC_STATION")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ElectricStationWaypoint extends Waypoint {

    private String electricStationName;
    private double electricityPrice;
    @ElementCollection
    @CollectionTable(name = "waypoint_connectors", joinColumns = @JoinColumn(name = "waypoint_id"))
    @MapKeyColumn(name = "connector_type")
    @Column(name = "max_charge_rate_kw")
    private Map<String, Double> connectors;
}
