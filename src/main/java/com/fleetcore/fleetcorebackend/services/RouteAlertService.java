package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.RouteAlertDto;
import com.fleetcore.fleetcorebackend.entities.RouteAlert;
import com.fleetcore.fleetcorebackend.entities.enums.AlertStatus;
import com.fleetcore.fleetcorebackend.entities.enums.AlertType;
import com.fleetcore.fleetcorebackend.repository.RouteAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RouteAlertService {

    @Autowired
    private RouteAlertRepository routeAlertRepository;

    public void saveRouteAlert(RouteAlertDto routeAlertDto){
        RouteAlert routeAlert = convertDtoToEntity(routeAlertDto);
        routeAlertRepository.save(routeAlert);
    }

    public List<RouteAlertDto> getAllByRouteId(Long routeId){
        List<RouteAlert> routeAlertList = routeAlertRepository.getAllByRouteId(routeId);
        List<RouteAlertDto> routeAlertDtos = routeAlertList.stream()
                .map(this::convertEntityToDto)
                .toList();
        return routeAlertDtos;
    }

    public RouteAlertDto getCurrentUnresolvedAlert(Long routeId){
        List<RouteAlert> routeAlertsList = routeAlertRepository.getAllByRouteId(routeId);
        RouteAlert unresolvedAlert = routeAlertsList.stream().filter(alert -> alert.getAlertStatus().equals(AlertStatus.UNRESOLVED)).findFirst().orElse(null);
        if(unresolvedAlert != null){
            RouteAlertDto dto = convertEntityToDto(unresolvedAlert);
            return dto;
        }
        return null;
    }

    public void markRouteAlertAsResolved(Long routeAlertId, Double cost){
        RouteAlert routeAlert = routeAlertRepository.findById(routeAlertId).orElse(null);
        if(routeAlert != null){
            routeAlert.setAlertStatus(AlertStatus.RESOLVED);
            routeAlert.setAlertResolvedDate(new Date());
            routeAlert.setCosts(cost);
            routeAlertRepository.save(routeAlert);
        }
    }

    private RouteAlert convertDtoToEntity(RouteAlertDto routeAlertDto){
        RouteAlert routeAlert = new RouteAlert();
        routeAlert.setAlertType(AlertType.valueOf(routeAlertDto.getAlertType()));
        routeAlert.setAlertDescription(routeAlertDto.getAlertDescription());
        routeAlert.setAlertIssuedDate(routeAlertDto.getAlertIssuedDate());
        routeAlert.setAlertResolvedDate(routeAlertDto.getAlertResolvedDate());
        routeAlert.setLatitude(routeAlertDto.getLatitude());
        routeAlert.setLongitude(routeAlertDto.getLongitude());
        routeAlert.setAlertStatus(AlertStatus.valueOf(routeAlertDto.getAlertStatus()));
        routeAlert.setCosts(routeAlertDto.getCosts());
        routeAlert.setRouteId(routeAlertDto.getRouteId());
        return routeAlert;
    }

    private RouteAlertDto convertEntityToDto(RouteAlert routeAlert){
        RouteAlertDto dto = new RouteAlertDto();
        dto.setId(routeAlert.getId());
        dto.setAlertType(routeAlert.getAlertType().name());
        dto.setAlertDescription(routeAlert.getAlertDescription());
        dto.setAlertIssuedDate(routeAlert.getAlertIssuedDate());
        dto.setAlertResolvedDate(routeAlert.getAlertResolvedDate());
        dto.setLatitude(routeAlert.getLatitude());
        dto.setLongitude(routeAlert.getLongitude());
        dto.setAlertStatus(routeAlert.getAlertStatus().name());
        dto.setCosts(routeAlert.getCosts());
        dto.setRouteId(routeAlert.getRouteId());
        return dto;
    }
}
