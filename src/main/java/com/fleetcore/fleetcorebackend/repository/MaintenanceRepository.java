package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> getAllByVehicleId(Long vehicleId);

}
