package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.statistics.VehicleStatisticsDto;
import com.fleetcore.fleetcorebackend.entities.Maintenance;
import com.fleetcore.fleetcorebackend.entities.RouteAlert;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.entities.enums.AlertType;
import com.fleetcore.fleetcorebackend.entities.enums.RouteStatus;
import com.fleetcore.fleetcorebackend.entities.Route;
import com.fleetcore.fleetcorebackend.repositories.MaintenanceRepository;
import com.fleetcore.fleetcorebackend.repositories.RouteAlertRepository;
import com.fleetcore.fleetcorebackend.repositories.RouteRepository;
import com.fleetcore.fleetcorebackend.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteAlertRepository routeAlertRepository;


    public List<Vehicle> findAll(){
        return this.vehicleRepository.findAll();
    }

    public List<Vehicle> getVehiclesByAdminId(Long adminId){
            return this.vehicleRepository.getVehiclesByAdminId(adminId);
    }

    public Vehicle addVehicle(Vehicle vehicle){
        return this.vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Vehicle vehicle){
        return this.vehicleRepository.save(vehicle);
    }


    public void deleteVehiclesById(List<Long> vehicleIds) {
        for(Long id: vehicleIds) {
            vehicleRepository.deleteVehicleById(id);
        }
    }

    public Vehicle getVehicleById(Long id){
        return this.vehicleRepository.getVehicleById(id);
    }

    public List<Vehicle> getAvailableVehicles(Long adminId, LocalDateTime startTime, LocalDateTime arrivalTime){
        Date dateStartTime = java.sql.Timestamp.valueOf(startTime);
        Date dateArrivalTime  = java.sql.Timestamp.valueOf(arrivalTime);

        List<Vehicle> availableVehicles = vehicleRepository.findAvailableVehicles(adminId, dateStartTime, dateArrivalTime);

        return availableVehicles;
    }

    public VehicleStatisticsDto getVehicleStatistics(Long vehicleId) {
        VehicleStatisticsDto vehicleStatisticsDto = new VehicleStatisticsDto();
        List<Route> routes = routeRepository.getAllByVehicleId(vehicleId).stream()
                .filter(route -> route.getRouteStatus().equals(RouteStatus.COMPLETED))
                .toList();

        for(Route route : routes) {
            vehicleStatisticsDto.addRoute();
            List<RouteAlert> routeAlerts = routeAlertRepository.getAllByRouteId(route.getId());
            for(RouteAlert routeAlert : routeAlerts) {
                if(routeAlert.getAlertType().equals(AlertType.VEHICLE_BREAKDOWN)) {
                    vehicleStatisticsDto.addBreakdown();
                } else if(routeAlert.getAlertType().equals(AlertType.ACCIDENT_REPORT)) {
                    vehicleStatisticsDto.addAccident();
                }
            }
        }

        Date currentDate = new Date();
        List<Maintenance> maintenances = maintenanceRepository.getAllByVehicleId(vehicleId).stream()
                        .filter(maintenance -> maintenance.getMaintananceDate().before(currentDate))
                        .toList();

        vehicleStatisticsDto.setNumberOfMaintenances(maintenances.size());

        return vehicleStatisticsDto;
    }

}
