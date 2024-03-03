package com.fleetcore.fleetcorebackend.entities.routes.waypoints;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@DiscriminatorValue("START")
@Data
@AllArgsConstructor
public class StartWaypoint extends Waypoint {
}


