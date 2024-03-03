package com.fleetcore.fleetcorebackend.entities.routes.waypoints;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@DiscriminatorValue("DESTINATION")
@Data
@AllArgsConstructor
public class DestinationWaypoint extends Waypoint {

}
