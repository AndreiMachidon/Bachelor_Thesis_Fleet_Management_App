package com.fleetcore.fleetcorebackend.cronjobs;

import com.fleetcore.fleetcorebackend.entities.Maintenance;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import com.fleetcore.fleetcorebackend.services.MaintenanceService;
import com.fleetcore.fleetcorebackend.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
public class MaintenanceScheduler {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private MaintenanceService maintenanceService;

    @Scheduled(fixedRate = 5000)
    public void checkVehiclesForCurrentDateMaintenance() {
        List<Vehicle> vehicles = vehicleService.findAll();
        LocalDate today = LocalDate.now();
        for (Vehicle vehicle : vehicles) {
            Maintenance lastMaintenance = maintenanceService.getLastMaintenance(vehicle.getId()).orElse(null);
            if (lastMaintenance != null) {
                LocalDate maintenanceDate = lastMaintenance.getMaintananceDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                if (maintenanceDate.equals(today) && !vehicle.getVehicleStatus().equals(VehicleStatus.IN_SERVICE)) {
                    vehicle.setVehicleStatus(VehicleStatus.IN_SERVICE);
                    vehicleService.updateVehicle(vehicle);
                } else if (!maintenanceDate.equals(today) && vehicle.getVehicleStatus().equals(VehicleStatus.IN_SERVICE)) {
                    vehicle.setVehicleStatus(VehicleStatus.IDLE);
                    vehicleService.updateVehicle(vehicle);
                }

            }
        }
    }
}
