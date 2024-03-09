import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteDto } from 'src/app/components-2/admin/pages/routes/dto/route-dto.model';

@Component({
  selector: 'app-upcoming-route-card',
  templateUrl: './upcoming-route-card.component.html',
  styleUrls: ['./upcoming-route-card.component.css']
})
export class UpcomingRouteCardComponent {

  @Input() route: RouteDto;


   //1. Start and end location for the route
   startLocationAddress: string;
   endLocationAddress: string;

   constructor(private router: Router) { }
 

   ngOnInit() {
    this.getStartAndDestinationInformation();
  }

  getStartAndDestinationInformation() {
    this.startLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'START')[0].address;
    this.endLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'DESTINATION')[0].address;
  }

  viewRoute(){
    this.router.navigate(["driver-home/route-navigation", this.route.id]);
  }

}
