package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverDetailsRepository extends JpaRepository<DriverDetails, Long> {

    List<DriverDetails> getDriverDetailsByAdminId(Long adminId);

    DriverDetails getDriverDetailsById(Long id);



    @Transactional
    @Modifying
    public void deleteById(Long id);

}
