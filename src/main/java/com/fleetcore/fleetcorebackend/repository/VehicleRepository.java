package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.Vehicle;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {


    List<Vehicle> getVehiclesByAdminId(Long adminId);

    Vehicle getVehicleById(Long id);

    @Transactional
    void deleteVehicleById(Long id);

    @Query("SELECT v FROM Vehicle v WHERE v.adminId = :adminId AND v.id NOT IN (" +
            "SELECT r.vehicleId FROM Route r WHERE r.adminId = :adminId AND NOT (" +
            "r.arrivalTime < :startTime OR r.startTime > :endTime))")
    List<Vehicle> findAvailableVehicles(@Param("adminId") Long adminId,
                                        @Param("startTime") Date startTime,
                                        @Param("endTime") Date endTime);


}
