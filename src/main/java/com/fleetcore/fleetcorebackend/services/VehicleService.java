package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.repository.MaintenanceRepository;
import com.fleetcore.fleetcorebackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;


    public List<Vehicle> findAll(){
        return this.vehicleRepository.findAll();
    }

    public List<Vehicle> getVehiclesByAdminId(Long adminId){
            return this.vehicleRepository.getVehiclesByAdminId(adminId);
    }

    public Vehicle addVehicle(Vehicle vehicle){
        return this.vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Vehicle vehicle){
        return this.vehicleRepository.save(vehicle);
    }


    public void deleteVehiclesById(List<Long> vehicleIds) {
        for(Long id: vehicleIds) {
            vehicleRepository.deleteVehicleById(id);
        }
    }

    public Vehicle getVehicleById(Long id){
        return this.vehicleRepository.getVehicleById(id);
    }

    public List<Vehicle> getAvailableVehicles(Long adminId, LocalDateTime startTime, LocalDateTime arrivalTime){
        Date dateStartTime = java.sql.Timestamp.valueOf(startTime);
        Date dateArrivalTime  = java.sql.Timestamp.valueOf(arrivalTime);

        List<Vehicle> availableVehicles = vehicleRepository.findAvailableVehicles(adminId, dateStartTime, dateArrivalTime);

        return availableVehicles;
    }

}
