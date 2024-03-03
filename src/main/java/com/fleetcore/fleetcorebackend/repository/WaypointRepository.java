package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.routes.waypoints.Waypoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaypointRepository extends JpaRepository<Waypoint, Long> {
}
