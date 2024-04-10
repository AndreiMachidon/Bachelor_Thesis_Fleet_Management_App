package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.statistics.DashboardCardsInfoDto;
import com.fleetcore.fleetcorebackend.dto.statistics.DashboardFleetExpensesByCategoryDto;
import com.fleetcore.fleetcorebackend.dto.statistics.DashboardFuelCostsByTypeDto;
import com.fleetcore.fleetcorebackend.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping(path = "/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/cards")
    public ResponseEntity<DashboardCardsInfoDto> getDashboardsCardsInfo(@RequestParam("adminId") Long adminId) {
        try {
            DashboardCardsInfoDto cardsInfoDto = dashboardService.getDashboardCardInfo(adminId);
            return ResponseEntity.ok(cardsInfoDto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/fleet-expenses")
    public ResponseEntity<DashboardFleetExpensesByCategoryDto> getFleetExpensed(@RequestParam("adminId") Long adminId) {
        try {
            DashboardFleetExpensesByCategoryDto fleetExpensesByCategoryDto = dashboardService.getDashboardFleetExpensesByCategory(adminId);
            return ResponseEntity.ok(fleetExpensesByCategoryDto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/fuel-expenses")
    public ResponseEntity<DashboardFuelCostsByTypeDto> getFuelExpenses(@RequestParam("adminId") Long adminId) {
        try {
            DashboardFuelCostsByTypeDto fuelCostsByTypeDto = dashboardService.getDashboardFuelCostsByType(adminId);
            return ResponseEntity.ok(fuelCostsByTypeDto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
