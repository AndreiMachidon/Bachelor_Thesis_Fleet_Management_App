package com.fleetcore.fleetcorebackend.sockets;

import com.fleetcore.fleetcorebackend.dto.DriverLocationDto;
import com.fleetcore.fleetcorebackend.dto.RouteAlertDto;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/updateLocation/{routeId}")
    @SendTo("/topic/driverLocation/{routeId}")
    public DriverLocationDto updateDriverLocation(@DestinationVariable Long routeId, DriverLocationDto dto) {
        return dto;
    }

    @MessageMapping("/sendAlert/{routeId}")
    @SendTo("/topic/routeAlerts/{routeId}")
    public RouteAlertDto sendRouteAlert(@DestinationVariable Long routeId, RouteAlertDto dto){
        return dto;
    }

    @MessageMapping("/updateRouteStatus")
    @SendTo("/topic/routeStatuses")
    public String sendNewRouteStatus(String newRouteStatus){
        return newRouteStatus;
    }

}
