import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDto } from 'src/app/components-2/admin/pages/routes/dto/route-dto.model';
import { PolylineService } from 'src/app/components-2/admin/pages/routes/services/polyline.service';
import { RoutesService } from 'src/app/components-2/admin/pages/routes/services/routes.service';
import { NavigationService } from '../../services/navigation.service';
import { FuelPricesService } from 'src/app/components-2/admin/pages/routes/services/fuel-prices.service';
import { WebSocketsService } from 'src/app/components-2/global-services/web-sockets.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SendAlertDialogComponent } from './send-alert-dialog/send-alert-dialog.component';
import { RouteAlertService } from 'src/app/components-2/admin/pages/routes/services/route-alert.service';
import { response } from 'express';
import * as e from 'express';
import { RouteAlertDto } from 'src/app/components-2/admin/pages/routes/dto/route-alert-dto.model';
import { EndRouteDialogComponent } from './end-route-dialog/end-route-dialog.component';

@Component({
  selector: 'app-navigate-route',
  templateUrl: './navigate-route.component.html',
  styleUrls: ['./navigate-route.component.css']
})
export class NavigateRouteComponent {

  //1. Information about the route and the user position
  route: RouteDto = new RouteDto();
  userPosition: google.maps.LatLng;

  //2. Flag to control the UI if the route is started
  isRouteStarted: boolean = false;

  //3. For handling unresolved/resolved alerts
  isAlertActiveUnresolved: boolean = false;
  activeRouteAlert: RouteAlertDto;

  //4. Id for subscribing and unsubscribing for real-time location update
  watchId: number = null;

  //For driver movement mocking
  mockMovementIntervalId: any = null;

  constructor(private activePath: ActivatedRoute,
    private routeService: RoutesService,
    private webSocketService: WebSocketsService,
    private authService: AuthService,
    public dialog: MatDialog,
    public routeAlertService: RouteAlertService) { }

  ngOnInit(): void {
    this.getUserLocation();
    this.getNavigableRoute();

  }


  getNavigableRoute() {
    const routeId: number = Number.parseInt(this.activePath.snapshot.paramMap.get('id'));

    this.routeService.getByRouteId(routeId).subscribe(
      (response: RouteDto) => {
        this.route = response;
        if(this.route.routeStatus === 'IN_PROGRESS'){
          this.isRouteStarted = true;
          this.startRoute();
          this.mockDriverMovement();
        }

        this.routeAlertService.getCurrentUnresolvedRouteAlert(this.route.id).subscribe(
          (response: RouteAlertDto) => {
            if(response){
              console.log(response);
              this.isAlertActiveUnresolved = true;
              this.activeRouteAlert = response;
            }
          },
          (error) => {
            alert('There was an error getting the route alerts from the server')
          }
        )
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
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  async startRoute() {
    this.isRouteStarted = true;
    await this.webSocketService.initializeWebSocketConnection(this.authService.getAuthToken());
    //this.monitorUserLocation();
    this.updateRouteStatus('IN_PROGRESS');
    this.mockDriverMovement();
  }

  monitorUserLocation(): void {
    const tryToGetLocation = (attemptsLeft = 5) => {
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
          (position) => {
            this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.webSocketService.sendLocation(
              this.route.id,
              this.route.driverId,
              this.userPosition.lat(),
              this.userPosition.lng()
            );
          },
          (error) => {
            console.error('Error updating user location:', error);
            if (attemptsLeft > 0) {
              console.log(`Retrying... Attempts left: ${attemptsLeft - 1}`);
              setTimeout(() => tryToGetLocation(attemptsLeft - 1), 2000);
            }
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
  
    tryToGetLocation();
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
    const dialogRef = this.dialog.open(SendAlertDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: { latitude: this.userPosition.lat(), longitude: this.userPosition.lng(), routeId: this.route.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){ 
        this.routeAlertService.saveRouteAlert(result).subscribe(
          (response) => {
            this.webSocketService.sendAlert(this.route.id, result);
            this.routeAlertService.getCurrentUnresolvedRouteAlert(this.route.id).subscribe(
              (response: RouteAlertDto) => {
                if(response){
                  this.isAlertActiveUnresolved = true;
                  this.activeRouteAlert = response;
                }
              },
              (error) => {
                alert('There was an error getting the route alerts from the server')
              }
            )
            alert('Alert sent successfully');
          },
          (error) => {
            alert('There was an error sending the alert');
          }
        );
      }
    });
  }


  endRoute() {
    const dialogRef = this.dialog.open(EndRouteDialogComponent, {
      data: { latitude: this.userPosition.lat(), longitude: this.userPosition.lng(), routeId: this.route.id}
    });

    dialogRef.afterClosed().subscribe(response => {
      if(response === true){
        this.isRouteStarted = false;
        this.webSocketService.disconnectWebSocketConnection();
        if(this.watchId){
          navigator.geolocation.clearWatch(this.watchId);
        }
        if(this.mockMovementIntervalId){
          clearInterval(this.mockMovementIntervalId);
        }
        this.updateRouteStatus('UPCOMING'); //todo: change to COMPLETED
      }
    })
   
  }

  ngOnDestroy(){
    if(this.watchId){
      navigator.geolocation.clearWatch(this.watchId);
    }

    if (this.mockMovementIntervalId) {
      clearInterval(this.mockMovementIntervalId);
    }
   
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

  mockDriverMovement() {
    if (this.mockMovementIntervalId) {
      clearInterval(this.mockMovementIntervalId);
    }
    this.mockMovementIntervalId = setInterval(() => {
      this.userPosition = new google.maps.LatLng(
        this.userPosition.lat() + 0.0001,
        this.userPosition.lng() + 0.0001
      );
  
      this.webSocketService.sendLocation(
        this.route.id,
        this.route.driverId,
        this.userPosition.lat(),
        this.userPosition.lng()
      );
    }, 2000);
  }

  markAlertAsResolved(){
    this.routeAlertService.markRouteAlertAsResolved(this.activeRouteAlert.id).subscribe(
      (response) => {
        this.webSocketService.sendAlert(this.route.id, this.activeRouteAlert);
        this.isAlertActiveUnresolved = false;
        this.activeRouteAlert = null;
        alert('Notification sent successfully');
      },
      (error) => {
        alert('There was an error resolving the alert');
      }
    )
  }
   

}
