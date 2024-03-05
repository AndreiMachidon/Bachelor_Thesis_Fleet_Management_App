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
    public ResponseEntity<List<Route>> getAllRoutesByAdminId(@RequestParam Long adminId){
        try{
            List<Route> routeList = routeService.getAllByAdminId(adminId);
            return ResponseEntity.status(HttpStatus.OK).body(routeList);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
