package com.fleetcore.fleetcorebackend.entities;

import com.fleetcore.fleetcorebackend.entities.enums.RouteAlertStatus;
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

    private String alertText;
    private Date alertIssuedDate;
    private Date alertResolvedDate;
    private RouteAlertStatus alertStatus;

}