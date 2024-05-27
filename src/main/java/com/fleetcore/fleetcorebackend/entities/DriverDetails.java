package com.fleetcore.fleetcorebackend.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "driver_details")
public class DriverDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "rate_per_kilometer")
    private double ratePerKilometer;

    @Column(name = "license_expiry_date")
    private Date licenseExpiryDate;

    @Column(name = "years_of_experience")
    private int yearsOfExperience;

    @Column(name = "total_kilometers_driven")
    private double totalKilometersDriven;

    @Column(name = "admin_id")
    private Long adminId;

}
