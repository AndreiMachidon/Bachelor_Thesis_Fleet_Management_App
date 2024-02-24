package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @DeleteMapping(path = "/delete/{driverId}")
    public ResponseEntity<String> deleteDriver(@PathVariable("driverId") Long driverId){
        String response = driverService.deleteDriver(driverId);
        if(response != null){
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.status(400).body("There was an error while deleting the driver");
        }
    }

    @GetMapping("/getDriverByDriverId/{driverId}")
    public ResponseEntity<DriverDto> getDriverByDriverId(@PathVariable("driverId") Long driverId){
        try{
            DriverDto driverDto = driverService.getDriverByDriverId(driverId);
            return ResponseEntity.ok(driverDto);
        }catch (Exception ex){
            return ResponseEntity.status(400).build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<DriverDto>> getAvailableDrivers(@RequestParam("id") Long adminId,
                                                               @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
                                                               @RequestParam("arrivalTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime arrivalTime){

        List<DriverDto> availableDrivers = driverService.getAvailableDrivers(adminId, startTime, arrivalTime);
        return ResponseEntity.ok(availableDrivers);
    }

}
