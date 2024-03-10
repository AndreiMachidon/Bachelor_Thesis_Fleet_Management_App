import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { calculateDurationInHoursAndMinutes } from '../../util/google.maps.util';
import { RouteDto } from '../../dto/route-dto.model';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { WaypointDto } from '../../dto/waypoint-dto.model';
import { RoutesService } from '../../services/routes.service';

@Component({
  selector: 'app-save-final-route-dialog',
  templateUrl: './save-final-route-dialog.component.html',
  styleUrls: ['./save-final-route-dialog.component.css']
})
export class SaveFinalRouteDialogComponent {

  //route final details received from the main component
  routeFinalDetails: any = null;

  //information to display as info
  numberOfBreaks: number = 0;
  routeDurationFormatted: string = '';
  restBreaksDurationFormatted: string = '';
  totalRouteDurationFormatted: string = '';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<SaveFinalRouteDialogComponent>,
              private authService: AuthService,
              private routesService: RoutesService) {
    this.routeFinalDetails = data.routeFinalDetails;
    this.numberOfBreaks = this.routeFinalDetails.waypointsInfo.filter((waypoint: any) => waypoint.type ==='restBreak').length;

    this.routeDurationFormatted = calculateDurationInHoursAndMinutes(data.routeFinalDetails.routeDuration);
    this.restBreaksDurationFormatted = calculateDurationInHoursAndMinutes(data.routeFinalDetails.restBreaksDuration);
    this.totalRouteDurationFormatted = calculateDurationInHoursAndMinutes(data.routeFinalDetails.totalRouteDuration);
  }

  saveRoute(){
    let result: RouteDto = null;
  
    //1. Adding information about the route
    let route = new RouteDto();
    route.distance = this.routeFinalDetails.totalDistance;
    route.startTime = this.routeFinalDetails.routeStartDate;
    route.arrivalTime = this.routeFinalDetails.routeEndDate;
    route.fuelCost = this.routeFinalDetails.totalFuelCost;
    route.driverCost = this.routeFinalDetails.totalDriverCost;
    route.encodedPolyline = this.routeFinalDetails.googleMapsDirectionResult.routes[0].overview_polyline;
    route.routeStatus = null;
    route.driverNotes = null;
    route.adminId = this.authService.getUserDetails().id
    route.vehicleId = this.routeFinalDetails.vehicle.id;
    route.driverId = this.routeFinalDetails.driver.id;

    //2.Adding the waypoints
    route.waypoints = [];
    
    //Adding the starting point
    let startingPoint = new WaypointDto();
    startingPoint.address = this.routeFinalDetails.waypointsInfo[0].startAddress;
    startingPoint.latitude = this.routeFinalDetails.waypointsInfo[0].startLocation.lat();
    startingPoint.longitude = this.routeFinalDetails.waypointsInfo[0].startLocation.lng();
    startingPoint.type = 'Start';
    startingPoint.gasolinePrice = null;
    startingPoint.dieselPrice = null;
    startingPoint.electricityPrice = null;
    startingPoint.connectors = null;
    startingPoint.duration = null;

    route.waypoints.push(startingPoint);

    //Adding the rest of the waypoints
    this.routeFinalDetails.waypointsInfo.forEach((waypoint: any) => {
      let waypointDto = new WaypointDto();
      waypointDto.address = waypoint.endAddress;
      waypointDto.latitude = waypoint.endLocation.lat();
      waypointDto.longitude = waypoint.endLocation.lng();
      waypointDto.placeId = waypoint.placeId;
      switch(waypoint.type){
        case 'restBreak':
          waypointDto.type = 'RestBreak';
          waypointDto.duration = waypoint.restBreakDuration;
          break;
        case 'fuelStation':
          waypointDto.type = 'FuelStation';
          waypointDto.gasolinePrice = waypoint.gasolinePrice;
          waypointDto.dieselPrice = waypoint.diselPrice;
          waypointDto.fuelStationName = waypoint.gasStationInfo.displayName.text;
          break;
        case 'electricStation':
          waypointDto.type = 'ElectricStation';
          waypointDto.electricityPrice = waypoint.electricityPrice;
          const connectors: Record<string, number> = {};
          if(waypoint.evChargeInfo.evChargeOptions !== undefined){
          waypoint.evChargeInfo.evChargeOptions.connectorAggregation.forEach(connector => {
            connectors[connector.type] = connector.maxChargeRateKw;
          });
        }
          waypointDto.connectors = connectors;
          waypointDto.electricStationName = waypoint.evChargeInfo.displayName.text;
           break;
        case 'destination':
          waypointDto.type = 'Destination';
          break;
      }
      route.waypoints.push(waypointDto);
    });
    
    this.routesService.saveRoute(route).subscribe(
      (response: RouteDto) => {
      this.dialogRef.close("Saved");
    },
    (error) => {
      console.log(error);
      this.dialogRef.close("Error");
    }
    );

  }
}
