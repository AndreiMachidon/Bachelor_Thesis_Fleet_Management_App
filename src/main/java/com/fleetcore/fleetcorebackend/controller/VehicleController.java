package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.services.VehicleService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<Vehicle>> getAllVehicles(@RequestParam("id") Long adminId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByAdminId(adminId);

        if(vehicles.size() != 0){
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
}
