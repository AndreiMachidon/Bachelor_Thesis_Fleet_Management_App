import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteDto } from 'src/app/components-2/admin/pages/routes/dto/route-dto.model';
import { MonitorLocationService } from '../../services/monitor-location.service';

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
   startedRouteId: number;

   constructor(private router: Router,
    private monitorLocationService: MonitorLocationService) { }
 

   ngOnInit() {
    this.getStartAndDestinationInformation();
    this.startedRouteId = this.monitorLocationService.getStartedRouteId();
  }

  getStartAndDestinationInformation() {
    this.startLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'START')[0].address;
    this.endLocationAddress = this.route.waypoints.filter(waypoint => waypoint.type === 'DESTINATION')[0].address;
  }

  viewRoute(){
    this.router.navigate(["driver-home/route-navigation", this.route.id]);
  }

  formatRouteStatus(status: string): string {
    switch(status) {
      case 'UPCOMING':
        return 'Upcoming';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'FINISHED':
        return 'Finished';
      case 'ALERT_ACTIVE':
        return 'Alert Active';
      default:
        return status;
    }
  }

}
