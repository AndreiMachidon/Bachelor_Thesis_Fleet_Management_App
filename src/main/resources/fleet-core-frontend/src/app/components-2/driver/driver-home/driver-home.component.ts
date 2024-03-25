import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent {

  driverDetails: any;
  

  constructor(authService: AuthService, private router: Router){
    this.driverDetails = authService.getUserDetails();
  }

  navigateToRouteSelection() {
    this.router.navigate(['/driver-home/routes']);
}

}
