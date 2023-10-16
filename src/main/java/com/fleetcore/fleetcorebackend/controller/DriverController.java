package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<DriverDto>> getAllVehicles(@RequestParam("id") Long adminId) {
        List<DriverDto> driversDetails = driverService.getDriversByAdminId(adminId);
        return ResponseEntity.ok(driversDetails);
    }

}
