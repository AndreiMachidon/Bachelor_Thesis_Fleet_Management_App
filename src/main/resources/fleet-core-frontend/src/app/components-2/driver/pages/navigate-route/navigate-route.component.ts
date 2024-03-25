import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDto } from 'src/app/components-2/admin/pages/routes/dto/route-dto.model';
import { PolylineService } from 'src/app/components-2/admin/pages/routes/services/polyline.service';
import { RoutesService } from 'src/app/components-2/admin/pages/routes/services/routes.service';
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
import { StartRouteDialogComponent } from './start-route-dialog/start-route-dialog.component';
import { MonitorLocationService } from '../../services/monitor-location.service';
import { MarkAlertResolvedDialogComponent } from './mark-alert-resolved-dialog/mark-alert-resolved-dialog.component';

@Component({
  selector: 'app-navigate-route',
  templateUrl: './navigate-route.component.html',
  styleUrls: ['./navigate-route.component.css']
})
export class NavigateRouteComponent {

  //1. Information about the route and the user position
  route: RouteDto = new RouteDto();

  //2. Flag to control the UI if the route is started
  isRouteStarted: boolean = false;

  //3. For handling unresolved/resolved alerts
  isAlertActiveUnresolved: boolean = false;
  activeRouteAlert: RouteAlertDto;


  constructor(private activePath: ActivatedRoute,
    private routeService: RoutesService,
    private webSocketService: WebSocketsService,
    private authService: AuthService,
    public dialog: MatDialog,
    public routeAlertService: RouteAlertService,
    private monitorLocationService: MonitorLocationService) { }

  ngOnInit(): void {
    
    this.getNavigableRoute();

    this.webSocketService.initializeWebSocketConnection(this.authService.getAuthToken()).then(() => {

      if(this.monitorLocationService.getWatchLocationId() == null && this.route.routeStatus === 'IN_PROGRESS'){
        this.monitorUserLocation();
      }

      // if(this.monitorLocationService.getMockLocationId() == null){
      //   this.mockDriverMovement();
      // }

    });


  }


  getNavigableRoute() {
    const routeId: number = Number.parseInt(this.activePath.snapshot.paramMap.get('id'));

    this.routeService.getByRouteId(routeId).subscribe(
      async (response: RouteDto) => {
        this.route = response;
        if (this.route.routeStatus === 'IN_PROGRESS') {
          this.isRouteStarted = true;
          await this.startRoute();
        }

        this.routeAlertService.getCurrentUnresolvedRouteAlert(this.route.id).subscribe(
          (response: RouteAlertDto) => {
            if (response) {
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
          this.monitorLocationService.setUserPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
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

  acknowledgeUserAgreementForLocation() {
    const dialogRef = this.dialog.open(StartRouteDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.startRoute();
      }
    }
    );
  }


  async startRoute() {
    this.isRouteStarted = true;
    await this.webSocketService.initializeWebSocketConnection(this.authService.getAuthToken());

    if (this.monitorLocationService.getWatchLocationId() == null) {
      this.monitorUserLocation();
    }
    
    //   if(this.monitorLocationService.getMockLocationId() == null){
    //     this.mockDriverMovement();
    //  }

    this.updateRouteStatus('IN_PROGRESS');

  }

  monitorUserLocation(): void {
    const tryToGetLocation = (attemptsLeft = 5) => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            this.monitorLocationService.setUserPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude)); 
            this.webSocketService.sendLocation(
              this.route.id,
              this.route.driverId,
              this.monitorLocationService.getUserPosition().lat(),
              this.monitorLocationService.getUserPosition().lng()
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
        this.monitorLocationService.setWatchLocationId(watchId);
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    tryToGetLocation();
  }

  showNavigation() {
    this.openGoogleMapsNavigation();
  }

  openGoogleMapsNavigation() {
    const origin = `${this.monitorLocationService.getUserPosition().lat()},${this.monitorLocationService.getUserPosition().lng()}`;
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
      data: { latitude: this.monitorLocationService.getUserPosition().lat(), longitude: this.monitorLocationService.getUserPosition().lng(), routeId: this.route.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.routeAlertService.saveRouteAlert(result).subscribe(
          (response) => {
            this.webSocketService.sendAlert(this.route.id, result);
            this.routeAlertService.getCurrentUnresolvedRouteAlert(this.route.id).subscribe(
              (response: RouteAlertDto) => {
                if (response) {
                  this.isAlertActiveUnresolved = true;
                  this.activeRouteAlert = response;
                  this.updateRouteStatus('ALERT_ACTIVE');
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
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        this.isRouteStarted = false;
        if (this.monitorLocationService.getWatchLocationId() != null) {
          this.monitorLocationService.resetWatchLocationId();
        }
        
        if (this.monitorLocationService.getMockLocationId() != null) {
          this.monitorLocationService.resetMockLocationId();
        }
        this.monitorLocationService.resetUserPosition();
        this.updateRouteStatus('COMPLETED'); //todo: change to COMPLETED
      }
    })

  }

  updateRouteStatus(newStatus: string) {
    this.routeService.updateRouteStatus(this.route.id, newStatus).subscribe(
      (response) => {
        this.webSocketService.sendRouteStatusUpdate(newStatus);
      },
      (error) => {
        alert('There was an error updating the route status')
      }
    )
  }

  mockDriverMovement() {
    const mockMovementIntervalId = setInterval(() => {
      this.monitorLocationService.setUserPosition(new google.maps.LatLng(
        this.monitorLocationService.getUserPosition().lat() + 0.0001,
        this.monitorLocationService.getUserPosition().lng() + 0.0001
      )); 

      this.webSocketService.sendLocation(
        this.route.id,
        this.route.driverId,
        this.monitorLocationService.getUserPosition().lat(),
        this.monitorLocationService.getUserPosition().lng()
      );
    }, 2000) as unknown as number;

    this.monitorLocationService.setMockLocationId(mockMovementIntervalId);

  }

  openAlertResolvedDialog() {
    const dialogRef = this.dialog.open(MarkAlertResolvedDialogComponent, {
      data: { alert: this.activeRouteAlert }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {   
        const cost = result.costs;   
        this.markAlertAsResolved(cost);
      }
    });
  }
  
  markAlertAsResolved(cost: number) {
    this.routeAlertService.markRouteAlertAsResolved(this.activeRouteAlert.id, cost).subscribe(
      (response) => {
        this.updateRouteStatus('IN_PROGRESS');
        this.webSocketService.sendAlert(this.route.id, {...this.activeRouteAlert, costs: cost});
        this.isAlertActiveUnresolved = false;
        this.activeRouteAlert = null;
        alert('Notification sent successfully');
      },
      (error) => {
        alert('There was an error resolving the alert');
      }
    );
  }


}
