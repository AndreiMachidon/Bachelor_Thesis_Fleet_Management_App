import { Component, Input } from '@angular/core';
import { WaypointDto } from 'src/app/components-2/admin/pages/routes/dto/waypoint-dto.model';

@Component({
  selector: 'app-driver-route-waypoints-stepper',
  templateUrl: './driver-route-waypoints-stepper.component.html',
  styleUrls: ['./driver-route-waypoints-stepper.component.css']
})
export class DriverRouteWaypointsStepperComponent {
  @Input() waypointsInfo: WaypointDto[];

  ngOnInit() {
  }

  getWaypointDetails(waypoint: WaypointDto): string {
    switch (waypoint.type) {
      case 'FUEL_STATION':
        return `${waypoint.fuelStationName}`;
      case 'ELECTRIC_STATION':
        return `${waypoint.electricStationName}`;
      case 'REST_BREAK':
        return `${waypoint.restBreakLocationName} - Rest Break`;
      case 'START':
        return "Start Location";
      case 'DESTINATION':
        return "Destination";
      default:
        return "Waypoint";
    }
  }
}
