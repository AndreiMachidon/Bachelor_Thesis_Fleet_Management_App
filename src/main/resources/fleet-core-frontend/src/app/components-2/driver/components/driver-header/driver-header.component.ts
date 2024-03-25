import { Component } from '@angular/core';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';

@Component({
  selector: 'app-driver-header',
  templateUrl: './driver-header.component.html',
  styleUrls: ['./driver-header.component.css']
})
export class DriverHeaderComponent {

  driverDetails: any;
  driverName: string;


  constructor(private authService: AuthService) {}


  ngOnInit() {
    this.driverDetails = this.authService.getUserDetails();
    this.driverName = this.driverDetails.firstName + ' ' + this.driverDetails.lastName;
  }
}
