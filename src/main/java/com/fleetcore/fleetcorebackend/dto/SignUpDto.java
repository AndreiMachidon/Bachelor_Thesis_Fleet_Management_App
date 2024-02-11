package com.fleetcore.fleetcorebackend.dto;



public record SignUpDto(String organisationName,
                        String firstName,
                        String lastName,
                        String phoneNumber,
                        String email,
                        String password,
                        String role) {

}
