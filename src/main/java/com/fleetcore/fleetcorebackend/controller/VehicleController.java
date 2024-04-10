package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.statistics.VehicleStatisticsDto;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(path = "/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<Vehicle>> getAllVehicles(@RequestParam("id") Long adminId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByAdminId(adminId);

        if(!vehicles.isEmpty()){
            return ResponseEntity.ok(vehicles);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping(path = "/save")
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle){
        System.out.println("Adding vehicle to db: " + vehicle);
         Vehicle savedVehicle = this.vehicleService.addVehicle(vehicle);
         return ResponseEntity.ok(savedVehicle);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteVehicles(@RequestBody List<Long> vehicleIds) {
        vehicleService.deleteVehiclesById(vehicleIds);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getVehicle")
    public ResponseEntity<Vehicle> getVehicleById(@RequestParam("id") Long vehicleId){
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles(@RequestParam("id") Long adminId,
                                                              @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
                                                              @RequestParam("arrivalTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime arrivalTime) {

        List<Vehicle> vehicles = vehicleService.getAvailableVehicles(adminId, startTime, arrivalTime);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/statistics")
    public ResponseEntity<VehicleStatisticsDto> getVehicleStatistics(@RequestParam("vehicleId") Long vehicleId){
        try {
            VehicleStatisticsDto statisticsDto = vehicleService.getVehicleStatistics(vehicleId);
            return ResponseEntity.ok(statisticsDto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
