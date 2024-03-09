import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WaypointDto } from '../../admin/pages/routes/dto/waypoint-dto.model';
import { convertWaypointDtoToCustomWaypoint, createCustomMarker, createInfoWindowForElectricStationsMarkerWaypoint, createInfoWindowForGasStationsMarkerWaypoint, createInfoWindowForRestBreaksMarkerWaypoint } from '../../admin/pages/routes/util/google.maps.util';
import { FuelPricesService } from '../../admin/pages/routes/services/fuel-prices.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private polylineSubject = new BehaviorSubject<google.maps.Polyline | null>(null);
  private waypointsMarkersSubject = new BehaviorSubject<google.maps.Marker[]>([]);

  setPolyline(polyline: google.maps.Polyline | null) {
    const currentPolyline = this.polylineSubject.getValue();
    if(currentPolyline) {
      currentPolyline.setMap(null);
    }

    this.polylineSubject.next(polyline);
  }

  getPolyline(): Observable<google.maps.Polyline | null> {
    return this.polylineSubject.asObservable();
  }

  setWaypoints(waypoints: WaypointDto[], map: google.maps.Map, fuelPriceService: FuelPricesService) {
    this.waypointsMarkersSubject.getValue().forEach(marker => marker.setMap(null));
    const markers = waypoints.map((waypointDto, index) => {
        const customWaypoint = convertWaypointDtoToCustomWaypoint(waypointDto);
        let marker = null;
        if(customWaypoint.type === 'START') {
          marker = createCustomMarker(map, customWaypoint.location, '../../../assets/markers/start_point.png'); // Sau altă imagine pentru DESTINATION
        } else if(customWaypoint.type === 'FUEL_STATION') {
          marker = createCustomMarker(map, customWaypoint.location, '../../../assets/markers/gas_station_waypoint.png');
          createInfoWindowForGasStationsMarkerWaypoint(map, customWaypoint, marker, fuelPriceService);
        } else if(customWaypoint.type === 'ELECTRIC_STATION') {
          marker = createCustomMarker(map, customWaypoint.location, '../../../assets/markers/electric_station_waypoint.png');
          createInfoWindowForElectricStationsMarkerWaypoint(map, customWaypoint, marker, fuelPriceService);
        } else if(customWaypoint.type === 'REST_BREAK') {
          marker = createCustomMarker(map, customWaypoint.location, '../../../assets/markers/rest_break_point.png');
          createInfoWindowForRestBreaksMarkerWaypoint(map, customWaypoint, marker, index);
        }else if(customWaypoint.type === 'DESTINATION'){
          marker = createCustomMarker(map, customWaypoint.location, '../../../assets/markers/end_point.png');
        }
          
        return marker;
    });

    this.waypointsMarkersSubject.next(markers);
}

  getWaypointsMarkers(): Observable<google.maps.Marker[]> {
    return this.waypointsMarkersSubject.asObservable();
  }
}
