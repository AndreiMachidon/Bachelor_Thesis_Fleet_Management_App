package com.fleetcore.fleetcorebackend.entities.routes.waypoints;

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

    //duration in minutes
    private Integer duration;
}