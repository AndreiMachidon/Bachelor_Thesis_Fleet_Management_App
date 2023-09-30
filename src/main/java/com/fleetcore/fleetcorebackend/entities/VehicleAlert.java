package com.fleetcore.fleetcorebackend.entities;

import com.fleetcore.fleetcorebackend.entities.enums.VehicleAlertType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class VehicleAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private VehicleAlertType alertType;

    private String alertDescription;
    private Date alertTime;
    private Date resolvedDate;

}
