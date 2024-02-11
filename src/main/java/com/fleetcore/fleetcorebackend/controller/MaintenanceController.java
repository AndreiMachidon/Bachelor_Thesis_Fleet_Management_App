package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.entities.Maintenance;
import com.fleetcore.fleetcorebackend.services.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/maintenances")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @PostMapping("/save")
    public ResponseEntity<Maintenance> saveMaintenanceForVehicle(@RequestBody Maintenance maintenance){
        Maintenance savedMaintenance = this.maintenanceService.save(maintenance);
        return ResponseEntity.ok(savedMaintenance);
    }

    @GetMapping("/getLastMaintenance")
    public ResponseEntity<Maintenance> getLastMaintenance(@RequestParam("vechileId") Long vehicleId){
        Optional<Maintenance> maintenance = maintenanceService.getLastMaintenance(vehicleId);
        if(maintenance.isPresent()){
            return ResponseEntity.ok(maintenance.get());
        }else{
            return ResponseEntity.status(400).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Maintenance>> getVehicleMaintenanceHistory(@RequestParam("vehicleId") Long vehicleId){
        List<Maintenance> maintenanceList = maintenanceService.getAllMaintenancesForVehicle(vehicleId);
        return ResponseEntity.ok(maintenanceList);
    }
}
