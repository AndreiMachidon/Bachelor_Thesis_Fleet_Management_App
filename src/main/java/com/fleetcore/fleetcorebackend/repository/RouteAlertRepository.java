package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.RouteAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteAlertRepository extends JpaRepository<RouteAlert, Long> {

    List<RouteAlert> getAllByRouteId(Long routeId);

}
