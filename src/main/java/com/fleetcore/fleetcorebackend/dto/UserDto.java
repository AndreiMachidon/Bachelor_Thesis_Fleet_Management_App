package com.fleetcore.fleetcorebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String organisationName;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String role;
    private String token;
}
