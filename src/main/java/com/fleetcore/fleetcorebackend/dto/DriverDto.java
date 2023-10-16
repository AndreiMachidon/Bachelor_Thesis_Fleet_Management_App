package com.fleetcore.fleetcorebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DriverDto {

    private Long id;

    private String organisationName;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private String email;

    private String role;

    private byte[] imageData;

    private double ratePerKilometer;

    private Date licenseExpiryDate;

    private int yearsOfExperience;

    private double totalKilometersDriven;

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
