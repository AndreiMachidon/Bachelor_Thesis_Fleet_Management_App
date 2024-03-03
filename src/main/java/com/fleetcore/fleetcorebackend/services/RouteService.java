package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.RouteDto;
import com.fleetcore.fleetcorebackend.entities.enums.RouteStatus;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import com.fleetcore.fleetcorebackend.entities.routes.waypoints.Waypoint;
import com.fleetcore.fleetcorebackend.repository.RouteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private WaypointService waypointService;


    @Transactional
    public Route saveRoute(RouteDto routeDto){
        Route route = convertDtoToEntity(routeDto);
        List<Waypoint> waypointList = waypointService.convertDtoToEntities(routeDto.getWaypoints(), route);
        route.setWaypoints(waypointList);
        return routeRepository.save(route);
    }

    public Route convertDtoToEntity(RouteDto routeDto){
        Route route = new Route();
        route.setDistance(routeDto.getDistance());
        route.setStartTime(routeDto.getStartTime());
        route.setArrivalTime(routeDto.getArrivalTime());
        route.setFuelCost(routeDto.getFuelCost());
        route.setDriverCost(routeDto.getDriverCost());
        route.setRouteStatus(RouteStatus.UPCOMING);
        route.setAdminId(routeDto.getAdminId());
        route.setVehicleId(routeDto.getVehicleId());
        route.setDriverId(routeDto.getDriverId());
        route.setEncodedPolyline(routeDto.getEncodedPolyline());
        return route;
    }


}
