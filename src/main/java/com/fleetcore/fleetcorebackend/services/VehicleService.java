package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;


    public List<Vehicle> getVehiclesByAdminId(Long adminId){
            return this.vehicleRepository.getVehiclesByAdminId(adminId);
    }

    public Vehicle addVehicle(Vehicle vehicle){
        return this.vehicleRepository.save(vehicle);
    }


    public void deleteVehiclesById(List<Long> vehicleIds) {
        for(Long id: vehicleIds) {
            vehicleRepository.deleteVehicleById(id);
        }
    }

    public Vehicle getVehicleById(Long id){
        return this.vehicleRepository.getVehiclesById(id);
    }

}
