package com.fleetcore.fleetcorebackend.entities.waypoints;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("REST_BREAK")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestBreakWaypoint extends Waypoint {

    private String restBreakLocationName;

    private Integer duration;
}