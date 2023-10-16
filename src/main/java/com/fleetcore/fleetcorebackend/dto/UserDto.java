package com.fleetcore.fleetcorebackend.dto;

import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private String token;
}
