package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverDetailsRepository extends JpaRepository<DriverDetails, Long> {

    public DriverDetails findById(long id);
}
