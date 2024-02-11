package com.fleetcore.fleetcorebackend.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Base64;
import java.util.List;

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

    @Column(name = "organisation_name", nullable = false)
    private String organisationName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(nullable = true)
    private String password;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
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
