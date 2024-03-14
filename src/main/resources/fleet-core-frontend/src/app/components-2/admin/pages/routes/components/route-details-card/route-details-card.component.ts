import { Component, Input } from '@angular/core';
import { } from 'googlemaps';
import { PolylineService } from '../../services/polyline.service';
import { FuelPricesService } from '../../services/fuel-prices.service';
import { RouteDto } from '../../dto/route-dto.model';
import { WebSocketsService } from 'src/app/components-2/global-services/web-sockets.service';
import { createCustomMarker } from '../../util/google.maps.util';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { DriverLocationDto } from '../../dto/driver-location-dto.model';
import { RouteAlertDto } from '../../dto/route-alert-dto.model';
import { RouteAlertService } from '../../services/route-alert.service';
import { RealTimeUpdatesService } from '../../services/real-time-updates.service';

@Component({
  selector: 'app-route-details-card',
  templateUrl: './route-details-card.component.html',
  styleUrls: ['./route-details-card.component.css']
})
export class RouteDetailsCardComponent {

  @Input() route: RouteDto;

  @Input() map: google.maps.Map;
  
  //1. Start and end location for the route
  startLocationAddress: string;
  endLocationAddress: string;

  //2.Total costs for the route
  totalCosts: number;

  //3. Polyline for displaying the route
  polyline: google.maps.Polyline = null;


  constructor(private polylineService: PolylineService,
              private fuelPricesService: FuelPricesService,
              private webSocketService: WebSocketsService,
              private authService: AuthService,
              private routeAlertsService: RouteAlertService,
              private realTimeUpdatesService: RealTimeUpdatesService) { }


  ngOnInit() {
    this.getStartAndDestinationInformation();
  }

  getStartAndDestinationInformation() {
    this.startLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'START')[0].address;
    this.endLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'DESTINATION')[0].address;
    this.totalCosts = this.route.fuelCost + this.route.driverCost;
  }

  displayRoute() {
    this.webSocketService.unsubscribeFromRouteLocation();
    this.webSocketService.unsubscribeFromRouteAlerts();
    this.webSocketService.disconnectWebSocketConnection();
    this.realTimeUpdatesService.resetInformation();
    const decodedPath = google.maps.geometry.encoding.decodePath(this.route.encodedPolyline);

    this.polyline = this.createPolyline(decodedPath);
    this.polyline.setMap(this.map);
    this.polylineService.setPolyline(this.polyline);

    const bounds = this.createBounds(decodedPath);
    this.map.fitBounds(bounds);

    this.polylineService.setWaypoints(this.route.waypoints, this.map, this.fuelPricesService);
  }

  async viewLiveRouteStatus(){
    this.displayRoute();
    await this.webSocketService.initializeWebSocketConnection(this.authService.getAuthToken());
    this.displayStoredRouteAlerts();
    this.subscribeToDriverLiveLocation();
    this.subscribeToRouteAlerts();
  }

  subscribeToDriverLiveLocation() {
    const routeId = this.route.id;
    this.webSocketService.subscribeToRouteLocation(routeId, (driverLocationDto) => {
      this.updateDriverLocationOnMap(driverLocationDto);
    });
  }

  updateDriverLocationOnMap(driverLocationDto: DriverLocationDto) {
    const newPosition = new google.maps.LatLng(driverLocationDto.latitude, driverLocationDto.longitude);
    if(!this.realTimeUpdatesService.getDriverMarker()) {
      this.realTimeUpdatesService.setDriverMarker(createCustomMarker(this.map, new google.maps.LatLng(driverLocationDto.latitude, driverLocationDto.longitude), '../../../../../../../assets/markers/driver_location_marker.png')); 
    }else{
      this.realTimeUpdatesService.getDriverMarker().setPosition(newPosition);
    }
  }

  subscribeToRouteAlerts(){
    this.webSocketService.subscribeToRouteAlerts(this.route.id, (routeAlertDto) => {
      console.log(routeAlertDto);
      
        this.displayStoredRouteAlerts();
    });
  }

  displayStoredRouteAlerts(){
    this.realTimeUpdatesService.getRouteAlertMarkers().forEach(marker => marker.setMap(null));
    this.realTimeUpdatesService.setRouteAlertsMarker([]);
    this.realTimeUpdatesService.setRoutesAlerts([]);
    this.routeAlertsService.getRouteAlerts(this.route.id).subscribe(
      (routeAlerts: RouteAlertDto[]) => {
        this.realTimeUpdatesService.setRoutesAlerts(routeAlerts);
        this.createMarkersForAlerts();
    }, (error) => {
      alert('Error getting route alerts');
    }
    );
  }

  createMarkersForAlerts(){
    this.realTimeUpdatesService.getRouteAlerts().forEach(alert => {
      if(alert.alertStatus === 'UNRESOLVED'){
        const marker = createCustomMarker(this.map, new google.maps.LatLng(alert.latitude, alert.longitude), '../../../../../../../assets/markers/active_alert_marker.png');
        this.realTimeUpdatesService.pushRouteAlertMarker(marker);
      }else if(alert.alertStatus === 'RESOLVED'){
        const marker = createCustomMarker(this.map, new google.maps.LatLng(alert.latitude, alert.longitude), '../../../../../../../assets/markers/resolved_alert_marker.png');
        this.realTimeUpdatesService.pushRouteAlertMarker(marker);
      }
    });
  }

  createPolyline(decodedPath: google.maps.LatLng[]) {
    return new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          strokeColor: '#0000FF',
          strokeOpacity: 1,
          scale: 1
        },
        offset: '100%',
        repeat: '8px'
      }],
    });
  }

  createBounds(decodedPath: google.maps.LatLng[]) {
    const bounds = new google.maps.LatLngBounds();
    decodedPath.forEach((point) => {
      bounds.extend(point);
    });

    return bounds;
  }

  formatRouteStatus(status: string): string {
    switch(status) {
      case 'UPCOMING':
        return 'Upcoming';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'FINISHED':
        return 'Finished';
      default:
        return status;
    }
  }

}


