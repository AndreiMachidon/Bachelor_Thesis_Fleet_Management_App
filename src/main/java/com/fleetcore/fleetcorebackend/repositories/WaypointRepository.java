package com.fleetcore.fleetcorebackend.repositories;

import com.fleetcore.fleetcorebackend.entities.waypoints.Waypoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaypointRepository extends JpaRepository<Waypoint, Long> {
}
