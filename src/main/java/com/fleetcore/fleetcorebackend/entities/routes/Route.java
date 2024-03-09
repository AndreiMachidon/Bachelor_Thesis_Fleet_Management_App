package com.fleetcore.fleetcorebackend.entities.routes;


import com.fleetcore.fleetcorebackend.entities.enums.RouteStatus;
import com.fleetcore.fleetcorebackend.entities.routes.waypoints.Waypoint;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double distance;
    private Date startTime;
    private Date arrivalTime;
    private double fuelCost;
    private double driverCost;

    @Column(columnDefinition="LONGTEXT")
    private String encodedPolyline;

    private RouteStatus routeStatus;

    private String driverNotes;

    private long adminId;
    private long vehicleId;
    private long driverId;

    @OneToMany(mappedBy = "route", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Waypoint> waypoints = new ArrayList<>();

}
