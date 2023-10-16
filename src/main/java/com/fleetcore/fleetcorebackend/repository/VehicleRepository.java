package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.Vehicle;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {


    public List<Vehicle> getVehiclesByAdminId(Long adminId);

    public Vehicle getVehiclesById(Long id);

    @Transactional
    void deleteVehicleById(Long id);

}
