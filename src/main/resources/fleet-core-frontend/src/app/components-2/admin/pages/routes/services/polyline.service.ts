import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createCustomMarker, convertWaypointDtoToCustomWaypoint, createInfoWindowForGasStationsMarkerWaypoint, createInfoWindowForElectricStationsMarkerWaypoint, createInfoWindowForRestBreaksMarkerWaypoint} from '../util/google.maps.util';
import { FuelPricesService } from './fuel-prices.service';
import { WaypointDto } from '../dto/waypoint-dto.model';

@Injectable({
  providedIn: 'root'
})
export class PolylineService {
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
    console.log(waypoints);
    
    this.waypointsMarkersSubject.getValue().forEach(marker => marker.setMap(null));
    let restBreakIndex = 0;
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
          createInfoWindowForRestBreaksMarkerWaypoint(map, customWaypoint, marker, restBreakIndex);
          restBreakIndex++;
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

