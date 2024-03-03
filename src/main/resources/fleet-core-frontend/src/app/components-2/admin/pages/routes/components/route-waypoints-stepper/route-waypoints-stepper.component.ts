import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-route-waypoints-stepper',
  templateUrl: './route-waypoints-stepper.component.html',
  styleUrls: ['./route-waypoints-stepper.component.css']
})
export class RouteWaypointsStepperComponent {
  @Input() waypointsInfo: any[];

  ngOnInit(){
    console.log(this.waypointsInfo);
    
  }
  
  getWaypointType(waypointType: string) {
    if (waypointType === 'fuelStation') {
      return 'Fuel Station';
    } else if (waypointType === 'electricStation') {
      return 'EV Charging Station';
    }else if(waypointType === 'restBreak'){
      return 'Rest Break - 45 minutes';
    }else if(waypointType === 'destination'){
      return 'Destination';
    }else{
      return "Waypoint";
    }
  }
}
