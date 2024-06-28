package com.fleetcore.fleetcorebackend.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String organisationName;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String role;

    private String password;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Nullable
    private Long driverDetailsId;

    public void setImageData(String base64Data) {
        if (base64Data != null && !base64Data.isEmpty()) {
            this.imageData = Base64.getDecoder().decode(base64Data);
        } else {
            this.imageData = null;
        }
    }

    public String getImageData(){
        if (this.imageData != null) {
            return Base64.getEncoder().encodeToString(this.imageData);
        } else {
            return null;
        }
    }

}
