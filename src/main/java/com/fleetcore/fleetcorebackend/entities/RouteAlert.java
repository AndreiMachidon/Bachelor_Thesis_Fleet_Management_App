package com.fleetcore.fleetcorebackend.entities;

import com.fleetcore.fleetcorebackend.entities.enums.AlertStatus;
import com.fleetcore.fleetcorebackend.entities.enums.AlertType;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RouteAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private AlertType alertType;
    private String alertDescription;
    private Date alertIssuedDate;

    @Nullable
    private Date alertResolvedDate;

    private double longitude;
    private double latitude;
    private AlertStatus alertStatus;

    private double costs;

    private long routeId;

}
