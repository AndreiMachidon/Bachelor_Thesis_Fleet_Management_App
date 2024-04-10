import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../services/my-drivers-service.service';
import { formatNumber } from '@angular/common';
import { DriverStatisticsDto } from '../dto/driver-statistics.dto';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css']
})
export class DriverDetailsComponent {
    driver: Driver;
    driverGeneralStatistics: any[];
    driverTotalEarningsStatistic: any[];

    constructor(private route: ActivatedRoute,
                private driversSerive: MyDriversService,
                private router: Router) {
                
                };

  ngOnInit(){
    const driverId: number = Number.parseInt(this.route.snapshot.paramMap.get('id'));

    this.driversSerive.getDriverDtoByDriverId(driverId).subscribe(
      (response: Driver) => {
        this.driver = response;

        this.driversSerive.getDriverStatistics(this.driver.id).subscribe(
          (response: DriverStatisticsDto) => {
            this.convertDriverGeneralStatisticsToCardNumbersFormat(response);
            this.convertDriverTotalEarningsStatisticToCardNumbersFormat(response);
          },
          (error) => {
            alert("There was an error while getting the driver statistics from the server")
          }
        )
      },
      (error) => {
        alert("There was an error while getting the driver details from the server")
      }
    )
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  formatTotalEarnings(totalEarnings: any): string {
    return `${formatNumber(totalEarnings.value, 'de', '1.0-0')} €`;
  }

  convertDriverGeneralStatisticsToCardNumbersFormat(driverStatisticsDto: DriverStatisticsDto) {
    this.driverGeneralStatistics = [
      {
        "name": "Number of accidents",
        "value": driverStatisticsDto.numberOfAccidents
      },
      {
        "name": "Completed routes",
        "value": driverStatisticsDto.numberOfCompletedRoutes
      },
    ]
  }

  convertDriverTotalEarningsStatisticToCardNumbersFormat(driverStatisticsDto: DriverStatisticsDto) {
    this.driverTotalEarningsStatistic = [
      {
        "name": "Total earnings",
        "value": driverStatisticsDto.totalEarnings
      }
    ]
  }

}
