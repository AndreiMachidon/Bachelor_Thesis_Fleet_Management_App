import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDto } from 'src/app/components-2/admin/pages/routes/dto/route-dto.model';
import { PolylineService } from 'src/app/components-2/admin/pages/routes/services/polyline.service';
import { RoutesService } from 'src/app/components-2/admin/pages/routes/services/routes.service';
import { NavigationService } from '../../services/navigation.service';
import { FuelPricesService } from 'src/app/components-2/admin/pages/routes/services/fuel-prices.service';

@Component({
  selector: 'app-navigate-route',
  templateUrl: './navigate-route.component.html',
  styleUrls: ['./navigate-route.component.css']
})
export class NavigateRouteComponent {

  route: RouteDto = new RouteDto();

  userPosition: google.maps.LatLng;

  isRouteStarted: boolean = false;

  constructor(private activePath: ActivatedRoute,
    private routeService: RoutesService) { }

  ngOnInit(): void {
    this.getNavigableRoute();
    this.getUserLocation();
  }

  getNavigableRoute() {
    const routeId: number = Number.parseInt(this.activePath.snapshot.paramMap.get('id'));

    this.routeService.getByRouteId(routeId).subscribe(
      (response) => {
        this.route = response;
        this.getUserLocation();
      },
      (error) => {
        alert('There was an error getting the route from the server')
      }
    )
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  startRoute() {
    this.isRouteStarted = true;
    this.monitorUserLocation();
    this.updateRouteStatus('IN_PROGRESS');
  }

  monitorUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  showNavigation(){
    this.openGoogleMapsNavigation();
  }

  openGoogleMapsNavigation(){
    const origin = `${this.userPosition.lat()},${this.userPosition.lng()}`;
    const destination = this.route.waypoints.find(wp => wp.type === 'DESTINATION');
    const destinationCoords = `${destination.latitude},${destination.longitude}`;

    const waypoints = this.route.waypoints
      .filter(wp => wp.type !== 'DESTINATION' && wp.type !== 'START')
      .map(wp => `${wp.latitude},${wp.longitude}`)
      .join('|');

    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationCoords}&travelmode=driving&dir_action=navigate&waypoints=${waypoints}`;

    window.open(mapsUrl, '_blank');
  }

  sendAlertToAdmin() {

  }

  endRoute() {
    this.isRouteStarted = false;
  }

  updateRouteStatus(newStatus: string){
    this.routeService.updateRouteStatus(this.route.id, newStatus).subscribe(
      (response) => {
        console.log(response);
        
      },
      (error) => {
        alert('There was an error updating the route status')
      }
    )
  }

}
