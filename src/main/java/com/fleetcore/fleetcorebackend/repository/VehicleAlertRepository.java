package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.VehicleAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleAlertRepository extends JpaRepository<VehicleAlert, Long> {

}
