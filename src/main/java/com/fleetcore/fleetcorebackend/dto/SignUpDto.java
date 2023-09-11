package com.fleetcore.fleetcorebackend.dto;

import org.springframework.context.annotation.Bean;


public record SignUpDto(String organisationName,
                        String firstName,
                        String lastName,
                        String phoneNumber,
                        String email,
                        String password,
                        String role) {

}
