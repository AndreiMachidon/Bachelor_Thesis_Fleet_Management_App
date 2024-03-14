import { Injectable } from '@angular/core';
import { RouteAlertDto } from '../dto/route-alert-dto.model';

@Injectable({
  providedIn: 'root'
})
export class RealTimeUpdatesService {

  private driverMarker: google.maps.Marker;
  private routeAlertsMarkers: google.maps.Marker[] = [];
  private routeAlerts: RouteAlertDto[] = [];

  constructor() { }

  setDriverMarker(marker: google.maps.Marker) {
    this.driverMarker = marker;
  }

  getDriverMarker(): google.maps.Marker {
    return this.driverMarker;
  }

  setRouteAlertsMarker(markers: google.maps.Marker[]) {
    this.routeAlertsMarkers = markers;
  }

  getRouteAlertMarkers(): google.maps.Marker[] {
    return this.routeAlertsMarkers;
  }

  pushRouteAlertMarker(marker: google.maps.Marker) {
    this.routeAlertsMarkers.push(marker);
  }

  setRoutesAlerts(routeAlerts: RouteAlertDto[]) {
   this.routeAlerts = routeAlerts;
  }

  getRouteAlerts(): RouteAlertDto[] {
    return this.routeAlerts;
  }

  resetInformation() {
    if(this.driverMarker) {
      this.driverMarker.setMap(null);
      this.driverMarker = null;
    }
    this.routeAlerts = [];
    this.routeAlertsMarkers.forEach(marker => marker.setMap(null));
    this.routeAlertsMarkers = [];
  }
}
