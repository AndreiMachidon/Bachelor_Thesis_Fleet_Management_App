package com.fleetcore.fleetcorebackend.entities;


import com.fleetcore.fleetcorebackend.entities.enums.RouteStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String startLocation;
    private String endLocation;
    private double distance;
    private double time;
    private Date startTime;
    private Date arrivalTime;
    private RouteStatus routeStatus;
    private double cost;
    private String driverNotes;

    private long adminId;
    private long vehicleId;
    private long driverId;




}
