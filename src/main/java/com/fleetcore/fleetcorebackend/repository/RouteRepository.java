package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.routes.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> getAllByDriverId(Long driverId);

    List<Route> getAllByAdminId(Long adminId);
}
