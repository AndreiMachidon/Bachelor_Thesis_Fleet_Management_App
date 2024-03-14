package com.fleetcore.fleetcorebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RouteAlertDto {
    private int id;
    private String alertType;
    private String alertDescription;
    private Date alertIssuedDate;
    private Date alertResolvedDate;
    private double longitude;
    private double latitude;
    private String alertStatus;
    private long routeId;
}
