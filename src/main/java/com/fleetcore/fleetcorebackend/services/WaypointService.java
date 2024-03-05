package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.WaypointDto;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import com.fleetcore.fleetcorebackend.entities.routes.waypoints.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WaypointService {
    public Waypoint convertDtoToEntity(WaypointDto dto, Route route) {
        Waypoint waypoint;
        switch (dto.getType()) {
            case "FuelStation":
                FuelStationWaypoint fuelStation = new FuelStationWaypoint();
                fuelStation.setGasolinePrice(dto.getGasolinePrice());
                fuelStation.setDieselPrice(dto.getDieselPrice());
                fuelStation.setFuelStationName(dto.getFuelStationName());
                waypoint = fuelStation;
                break;
            case "ElectricStation":
                ElectricStationWaypoint electricStation = new ElectricStationWaypoint();
                electricStation.setElectricityPrice(dto.getElectricityPrice());
                electricStation.setConnectors(dto.getConnectors());
                electricStation.setElectricStationName(dto.getElectricStationName());
                waypoint = electricStation;
                break;
            case "RestBreak":
                RestBreakWaypoint restBreak = new RestBreakWaypoint();
                restBreak.setDuration(dto.getDuration());
                waypoint = restBreak;
                break;
            case "Start":
                StartWaypoint startWaypoint = new StartWaypoint();
                waypoint = startWaypoint;
                break;
            case "Destination":
                DestinationWaypoint destinationWaypoint = new DestinationWaypoint();
                waypoint = destinationWaypoint;
                break;
            default:
                throw new IllegalArgumentException("Unknown waypoint type");
        }
        waypoint.setId(dto.getId());
        waypoint.setAddress(dto.getAddress());
        waypoint.setLatitude(dto.getLatitude());
        waypoint.setLongitude(dto.getLongitude());
        waypoint.setRoute(route);
        return waypoint;
    }

    public List<Waypoint> convertDtoToEntities(List<WaypointDto> dtoList, Route route){
        List<Waypoint> waypointList = new ArrayList<>();
        for(WaypointDto dto: dtoList){
            Waypoint waypoint = convertDtoToEntity(dto, route);
            waypointList.add(waypoint);
        }
        return waypointList;
    }

}
