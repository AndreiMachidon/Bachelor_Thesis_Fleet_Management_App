package com.fleetcore.fleetcorebackend.entities;

import com.fleetcore.fleetcorebackend.entities.enums.MaintenanceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "maintenance")
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private MaintenanceType maintenanceType;


    //field to showcase when the next Maintenance should be conducted
    //maintenance should be conducted every 20.000 km or for every 6 months
    private Date maintananceDate;
    private double currentVehicleMileage;

    private double price;

    private Long vehicleId;


}
