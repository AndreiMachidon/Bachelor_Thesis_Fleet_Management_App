import { Component, Input } from '@angular/core';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../services/my-drivers-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.css']
})
export class DriverCardComponent {

  @Input() driver: Driver;

  constructor(private driversService: MyDriversService,
    private router: Router) { }

  deleteDriver() {
    this.driversService.deleteDriver(this.driver.id).subscribe(
      (response) => {
        alert(response);
        window.location.reload();
      },
      (error) => {
        alert(error);
      }
    );

  }

  viewDriverDetails() {
    this.router.navigate(["admin-dashboard/driver-details", this.driver.id]);
  }

}
