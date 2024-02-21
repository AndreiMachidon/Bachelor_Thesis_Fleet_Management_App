package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("available")
    public ResponseEntity<List<DriverDto>> getAvailableDrivers(@PathVariable("id") Long adminId){
        return ResponseEntity.ok(null);
    }

}
