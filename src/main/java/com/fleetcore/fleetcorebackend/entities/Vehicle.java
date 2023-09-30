package com.fleetcore.fleetcorebackend.entities;

import com.fleetcore.fleetcorebackend.entities.enums.FuelType;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "make")
    private String make;

    @Column(name = "model")
    private String model;

    @Column(name = "vin")
    private String vin;

    @Column(name = "lincese_plate")
    private String lincesePlate;

    @Column(name = "milenage")
    private double milenage;

    @Column(name = "year_of_manufacture")
    private int yearOfManufacture;

    @Column(name = "fuelType")
    private FuelType fuelType;

    @Column(name = "cargo_capacity")
    private double cargoCapacity;

    @Column(name = "fuel_capacity")
    private double fuelCapacity;

    @Column(name = "fuel_consumption")
    private double fuelConsumption;

    @Column(name = "vehicle_status")
    private VehicleStatus vehicleStatus;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    //todo: foreign key
    private Integer adminId;

    public void setImageData(String base64Data) {
        if (base64Data != null && !base64Data.isEmpty()) {
            this.imageData = Base64.getDecoder().decode(base64Data);
        } else {
            this.imageData = null;
        }
    }

    public String getImageData() {
        if (this.imageData != null) {
            return Base64.getEncoder().encodeToString(this.imageData);
        } else {
            return null;
        }
    }

}
