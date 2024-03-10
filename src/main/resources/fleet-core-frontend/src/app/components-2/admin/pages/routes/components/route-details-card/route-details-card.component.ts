import { Component, Input } from '@angular/core';
import { } from 'googlemaps';
import { PolylineService } from '../../services/polyline.service';
import { FuelPricesService } from '../../services/fuel-prices.service';
import { RouteDto } from '../../dto/route-dto.model';

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
              private fuelPricesService: FuelPricesService) { }


  ngOnInit() {
    this.getStartAndDestinationInformation();
  }

  getStartAndDestinationInformation() {
    this.startLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'START')[0].address;
    this.endLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'DESTINATION')[0].address;
    this.totalCosts = this.route.fuelCost + this.route.driverCost;
  }

  displayRoute() {
    const decodedPath = google.maps.geometry.encoding.decodePath(this.route.encodedPolyline);

    this.polyline = this.createPolyline(decodedPath);
    this.polyline.setMap(this.map);
    this.polylineService.setPolyline(this.polyline);

    const bounds = this.createBounds(decodedPath);
    this.map.fitBounds(bounds);

    this.polylineService.setWaypoints(this.route.waypoints, this.map, this.fuelPricesService);
  }

  viewLiveRouteStatus(){
    
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


