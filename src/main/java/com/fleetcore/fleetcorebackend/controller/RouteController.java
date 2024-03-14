package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.RouteDto;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import com.fleetcore.fleetcorebackend.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/save")
    public ResponseEntity<Route> saveRoute(@RequestBody RouteDto routeDto){
        try{
            Route savedRoute = routeService.saveRoute(routeDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRoute);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<RouteDto>> getAllRoutesByAdminId(@RequestParam("adminId") Long adminId){
        try{
            List<RouteDto> routeList = routeService.getAllByAdminId(adminId);
            return ResponseEntity.status(HttpStatus.OK).body(routeList);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/findById")
    public ResponseEntity<RouteDto> getRouteById(@RequestParam("routeId") Long routeId){
        try{
            RouteDto foundRoute = routeService.getRouteById(routeId);
            return ResponseEntity.status(HttpStatus.OK).body(foundRoute);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/updateStatus")
    public ResponseEntity<String> updateRouteStatus(@RequestParam("routeId") Long routeId, @RequestParam("status") String routeStatus){
            try{
                routeService.updateRouteStatus(routeId, routeStatus);
                return ResponseEntity.ok("Route status updating succesfully to: " + routeStatus);
            }catch (Exception ex){
                return ResponseEntity.status(400).body("There was an error while updating the route status");
            }
    }


}
