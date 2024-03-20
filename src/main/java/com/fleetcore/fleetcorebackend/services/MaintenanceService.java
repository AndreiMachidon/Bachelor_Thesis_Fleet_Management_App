package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.entities.Maintenance;
import com.fleetcore.fleetcorebackend.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    public Maintenance save(Maintenance maintenance){
        return maintenanceRepository.save(maintenance);
    }

    public Optional<Maintenance> getLastMaintenance(long vehicleId){
        List<Maintenance> maintenanceList = maintenanceRepository.getAllByVehicleId(vehicleId);
        Optional<Maintenance> maintenance = maintenanceList.stream()
                .sorted(Comparator.comparing(Maintenance::getMaintananceDate))
                .findFirst();

        return maintenance;
    }

    public List<Maintenance> getAllMaintenancesForVehicle(long vehicleId){
        List<Maintenance> maintenanceList = maintenanceRepository.getAllByVehicleId(vehicleId);
        return maintenanceList.stream()
                .sorted(Comparator.comparing(Maintenance::getMaintananceDate))
                .collect(Collectors.toList());
    }
}
