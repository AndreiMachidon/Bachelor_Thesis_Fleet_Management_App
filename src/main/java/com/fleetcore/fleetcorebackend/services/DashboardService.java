package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.statistics.DashboardCardsInfoDto;
import com.fleetcore.fleetcorebackend.dto.statistics.DashboardFleetExpensesByCategoryDto;
import com.fleetcore.fleetcorebackend.dto.statistics.DashboardFuelCostsByTypeDto;
import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import com.fleetcore.fleetcorebackend.entities.Maintenance;
import com.fleetcore.fleetcorebackend.entities.RouteAlert;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.entities.enums.AlertStatus;
import com.fleetcore.fleetcorebackend.entities.enums.AlertType;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import com.fleetcore.fleetcorebackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverDetailsRepository driverDetailsRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private RouteAlertRepository routeAlertRepository;

    public DashboardCardsInfoDto getDashboardCardInfo(Long adminId) {
        DashboardCardsInfoDto dashboardCardsInfoDto = new DashboardCardsInfoDto();
        List<Vehicle> vehicleList = vehicleRepository.getVehiclesByAdminId(adminId);
        List<DriverDetails> driverDetailsList = driverDetailsRepository.getDriverDetailsByAdminId(adminId);
        List<Route> routesList = routeRepository.getAllByAdminId(adminId);

        processVehicles(dashboardCardsInfoDto, vehicleList);
        processDrivers(dashboardCardsInfoDto, driverDetailsList);
        processRoutes(dashboardCardsInfoDto, routesList);

        return dashboardCardsInfoDto;
    }

    public DashboardFleetExpensesByCategoryDto getDashboardFleetExpensesByCategory(Long adminId) {
        DashboardFleetExpensesByCategoryDto fleetExpensesByCategoryDto = new DashboardFleetExpensesByCategoryDto();
        List<Vehicle> vehicleList = vehicleRepository.getVehiclesByAdminId(adminId);
        List<Route> routes = routeRepository.getAllByAdminId(adminId);
        getTotalCostsOfMaintenances(vehicleList, fleetExpensesByCategoryDto);
        getTotalCostsOfFuel(routes, fleetExpensesByCategoryDto);
        getTotalCostsForDrivers(routes, fleetExpensesByCategoryDto);
        getTotalCostsForVehicleBreakdowns(routes, fleetExpensesByCategoryDto);
        return fleetExpensesByCategoryDto;
    }

    public DashboardFuelCostsByTypeDto getDashboardFuelCostsByType(Long adminId) {
        DashboardFuelCostsByTypeDto fuelCostsByType = new DashboardFuelCostsByTypeDto();
        List<Route> routes = routeRepository.getAllByAdminId(adminId);
        for(Route route : routes) {
            Vehicle vehicle = vehicleRepository.getVehicleById(route.getVehicleId());
            switch (vehicle.getFuelType()) {
                case DIESEL -> fuelCostsByType.addDieselCosts(route.getFuelCost());
                case GASOLINE -> fuelCostsByType.addGasolineCosts(route.getFuelCost());
                case ELECTRIC -> fuelCostsByType.addElectricityCosts(route.getFuelCost());
            }
        }
        return fuelCostsByType;
    }

    private void processVehicles(DashboardCardsInfoDto dto, List<Vehicle> vehicles) {
        if (vehicles != null && !vehicles.isEmpty()) {
            for (Vehicle vehicle : vehicles) {
                switch (vehicle.getVehicleStatus()) {
                    case IDLE -> dto.addIdleVehicle();
                    case ON_ROUTE -> dto.addOnRouteVehicle();
                    case IN_SERVICE -> dto.addInServiceVehicle();
                }
            }
            dto.setTotalVehicles(vehicles.size());
        }
    }

    private void processDrivers(DashboardCardsInfoDto dto, List<DriverDetails> drivers) {
        if (drivers != null) {
            double totalDistance = 0;
            double totalRate = 0;
            for (DriverDetails driver : drivers) {
                totalDistance += driver.getTotalKilometersDriven();
                totalRate += driver.getRatePerKilometer();
            }
            dto.setTotalDrivers(drivers.size());
            dto.setTotalDistance(totalDistance);
            if (!drivers.isEmpty()) {
                dto.setAverageDriversRate(totalRate / drivers.size());
            }
        }
    }

    private void processRoutes(DashboardCardsInfoDto dto, List<Route> routes) {
        if (routes != null && !routes.isEmpty()) {
            for (Route route : routes) {
                switch (route.getRouteStatus()) {
                    case UPCOMING -> dto.addUpcomingRoute();
                    case IN_PROGRESS -> dto.addInProgressRoute();
                    case COMPLETED -> dto.addCompletedRoute();
                }
            }
            dto.setTotalRoutes(routes.size());
        }
    }

    private void getTotalCostsOfMaintenances(List<Vehicle> vehicleList, DashboardFleetExpensesByCategoryDto dto) {
        double totalCosts = 0;
        for(Vehicle vehicle : vehicleList) {
            List<Maintenance> maintenances = maintenanceRepository.getAllByVehicleId(vehicle.getId());
           for(Maintenance maintenance : maintenances) {
               totalCosts += maintenance.getPrice();
           }
        }
        dto.setVehicleMaintenancesCosts(totalCosts);
    }

    private void getTotalCostsOfFuel(List<Route> routeList, DashboardFleetExpensesByCategoryDto dto) {
        double totalCosts = 0;
        for(Route route : routeList) {
            totalCosts += route.getFuelCost();
        }
        dto.setFuelCosts(totalCosts);
    }

    private void getTotalCostsForDrivers(List<Route> routeList, DashboardFleetExpensesByCategoryDto dto) {
        double totalCosts = 0;
        for(Route route : routeList) {
            totalCosts += route.getDriverCost();
        }
        dto.setDriversCosts(totalCosts);
    }

    private void getTotalCostsForVehicleBreakdowns(List<Route> routeList, DashboardFleetExpensesByCategoryDto dto) {
        double totalCosts = 0;
        for(Route route : routeList) {
            List<RouteAlert> routeAlertList = routeAlertRepository.getAllByRouteId(route.getId()).stream()
                    .filter((routeAlert) -> routeAlert.getAlertStatus().equals(AlertStatus.RESOLVED) && routeAlert.getAlertType().equals(AlertType.VEHICLE_BREAKDOWN))
                    .toList();
            for(RouteAlert routeAlert : routeAlertList) {
                totalCosts += routeAlert.getCosts();
            }
        }
        dto.setVehiclesBreakdownsCosts(totalCosts);
    }

}

