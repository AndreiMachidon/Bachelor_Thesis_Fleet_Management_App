import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../services/my-drivers-service.service';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css']
})
export class DriverDetailsComponent {
    driver: Driver;

    constructor(private route: ActivatedRoute,
                private driversSerive: MyDriversService,
                private router: Router){}

  ngOnInit(){
    const driverId: number = Number.parseInt(this.route.snapshot.paramMap.get('id'));

    this.driversSerive.getDriverDtoByDriverId(driverId).subscribe(
      (response: Driver) => {
        this.driver = response;
      },
      (error) => {
        alert("There was an error while getting the driver details from the server")
      }
    )
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }
}
