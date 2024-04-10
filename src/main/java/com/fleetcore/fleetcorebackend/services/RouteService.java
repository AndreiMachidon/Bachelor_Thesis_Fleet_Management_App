package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.RouteDto;
import com.fleetcore.fleetcorebackend.dto.WaypointDto;
import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.entities.enums.RouteStatus;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import com.fleetcore.fleetcorebackend.entities.routes.waypoints.Waypoint;
import com.fleetcore.fleetcorebackend.repositories.DriverDetailsRepository;
import com.fleetcore.fleetcorebackend.repositories.RouteRepository;
import com.fleetcore.fleetcorebackend.repositories.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private WaypointService waypointService;

    @Autowired
    private DriverDetailsRepository driverDetailsRepository;

    @Autowired
    private VehicleRepository vehicleRepository;


    @Transactional
    public Route saveRoute(RouteDto routeDto){
        Route route = convertDtoToEntity(routeDto);
        List<Waypoint> waypointList = waypointService.convertDtoToEntities(routeDto.getWaypoints(), route);
        route.setWaypoints(waypointList);
        return routeRepository.save(route);
    }

    public List<RouteDto> getAllByAdminId(Long adminId){
        List<Route> foundRoutes = routeRepository.getAllByAdminId(adminId);
        List<RouteDto> routeDtoList = new ArrayList<>();
        for(Route route: foundRoutes){
            RouteDto routeDto = convertEntityToDto(route);
            List<WaypointDto> waypointDtoList = waypointService.convertEntitiesToDtos(route.getWaypoints());
            routeDto.setWaypoints(waypointDtoList);
            routeDtoList.add(routeDto);
        }

        return routeDtoList;
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

    public RouteDto convertEntityToDto(Route route){
        RouteDto routeDto = new RouteDto();
        routeDto.setId(route.getId());
        routeDto.setDistance(route.getDistance());
        routeDto.setStartTime(route.getStartTime());
        routeDto.setArrivalTime(route.getArrivalTime());
        routeDto.setFuelCost(route.getFuelCost());
        routeDto.setDriverCost(route.getDriverCost());
        routeDto.setEncodedPolyline(route.getEncodedPolyline());
        routeDto.setRouteStatus(route.getRouteStatus().toString());
        routeDto.setAdminId(route.getAdminId());
        routeDto.setVehicleId(route.getVehicleId());
        routeDto.setDriverId(route.getDriverId());
        return routeDto;

    }


    public RouteDto getRouteById(Long routeId){
        Route route = routeRepository.getById(routeId);
        RouteDto routeDto = convertEntityToDto(route);
        List<WaypointDto> waypointDtoList = waypointService.convertEntitiesToDtos(route.getWaypoints());
        routeDto.setWaypoints(waypointDtoList);
        return routeDto;
    }

    public void updateRouteStatus(Long routeId, String routeStatus){
        try{
            Route foundRoute = routeRepository.findById(routeId).orElseThrow();
            foundRoute.setRouteStatus(RouteStatus.valueOf(routeStatus));
            if(RouteStatus.IN_PROGRESS.name().equals(routeStatus)){
                Vehicle vehicle = vehicleRepository.getVehicleById(foundRoute.getVehicleId());
                vehicle.setVehicleStatus(VehicleStatus.ON_ROUTE);
                vehicleRepository.save(vehicle);
            }
            if(RouteStatus.COMPLETED.name().equals(routeStatus)){
                DriverDetails driverDetails = driverDetailsRepository.getDriverDetailsById(foundRoute.getDriverId());
                driverDetails.setTotalKilometersDriven(driverDetails.getTotalKilometersDriven() + foundRoute.getDistance());
                driverDetailsRepository.save(driverDetails);

                Vehicle vehicle = vehicleRepository.getVehicleById(foundRoute.getVehicleId());
                vehicle.setMilenage(vehicle.getMilenage() + foundRoute.getDistance());
                vehicle.setVehicleStatus(VehicleStatus.IDLE);
                vehicleRepository.save(vehicle);
            }
            routeRepository.save(foundRoute);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }




}
