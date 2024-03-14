package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.RouteAlertDto;
import com.fleetcore.fleetcorebackend.services.RouteAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/routes/alerts")
public class RouteAlertController {

    @Autowired
    private RouteAlertService routeAlertService;

    @PostMapping("/save")
    public ResponseEntity<String> saveRouteAlert(@RequestBody RouteAlertDto routeAlertDto) {
        try{
            routeAlertService.saveRouteAlert(routeAlertDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Route Alert Created successfully");
        }catch (Exception ex){
            return ResponseEntity.status(400).body("There was an error saving the route alert");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<RouteAlertDto>> getAllByRouteId(@RequestParam("routeId") Long routeId){
        try{
            List<RouteAlertDto> routeAlertsList = routeAlertService.getAllByRouteId(routeId);
            return ResponseEntity.status(200).body(routeAlertsList);
        }catch (Exception ex){
            return ResponseEntity.status(400).build();
        }
    }

    @GetMapping("/unresolved")
    public ResponseEntity<RouteAlertDto> getUnresolvedAlertForRoute(@RequestParam("routeId") Long routeId){
        try {
            RouteAlertDto routeAlertDto = routeAlertService.getCurrentUnresolvedAlert(routeId);
            return ResponseEntity.ok(routeAlertDto);
        }catch (Exception ex){
            return ResponseEntity.status(400).build();
        }
    }

    @PatchMapping("/markResolved")
    public ResponseEntity<String> markRouteAlertAsResoled(@RequestParam("routeAlertId") Long routeAlertId){
        try {
            routeAlertService.markRouteAlertAsResolved(routeAlertId);
            return ResponseEntity.ok("Route Alert is marked as resolved");
        } catch (Exception ex){
            return ResponseEntity.status(400).build();
        }
    }

}
