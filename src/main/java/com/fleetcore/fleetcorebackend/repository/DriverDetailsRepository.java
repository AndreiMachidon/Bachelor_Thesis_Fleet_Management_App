package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverDetailsRepository extends JpaRepository<DriverDetails, Long> {

    public List<DriverDetails> getDriverDetailsByAdminId(Long adminId);

    public DriverDetails getDriverDetailsById(Long id);

}
