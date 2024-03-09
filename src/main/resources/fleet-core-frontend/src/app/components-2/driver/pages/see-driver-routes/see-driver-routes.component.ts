import { Component } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';

@Component({
  selector: 'app-see-driver-routes',
  templateUrl: './see-driver-routes.component.html',
  styleUrls: ['./see-driver-routes.component.css']
})
export class SeeDriverRoutesComponent {

  //1. The array of upcoming routes
  upcomingRoutes: any[] = [];

  constructor(private driverService: DriverService, private authService: AuthService){
    this.driverService.getUpcomingRoutes(this.authService.getUserDetails().id).subscribe(data => {
      this.upcomingRoutes = data;
    })
  }

}
