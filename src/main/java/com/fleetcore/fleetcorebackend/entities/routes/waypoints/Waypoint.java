package com.fleetcore.fleetcorebackend.entities.routes.waypoints;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fleetcore.fleetcorebackend.entities.enums.WaypointType;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type")
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class Waypoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;
    private Double latitude;
    private Double longitude;

    @Nullable
    private String placeId;

    @ManyToOne
    @JoinColumn(name = "route_id")
    @JsonIgnore
    private Route route;

    public WaypointType getWaypointType() {
        if (this instanceof FuelStationWaypoint) {
            return WaypointType.FUEL_STATION;
        } else if (this instanceof ElectricStationWaypoint) {
            return WaypointType.ELECTRIC_STATION;
        }else if (this instanceof  RestBreakWaypoint){
            return WaypointType.REST_BREAK;
        }else if(this instanceof StartWaypoint){
            return WaypointType.START;
        }else{
            return WaypointType.DESTINATION;
        }

    }
}
