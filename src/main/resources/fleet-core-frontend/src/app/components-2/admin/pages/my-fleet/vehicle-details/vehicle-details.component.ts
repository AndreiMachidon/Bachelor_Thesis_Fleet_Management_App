import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../admin-dashboard/models/vehicle.model';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../services/vehicle-service.service';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent {

  vehicle: Vehicle;

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService) { }

  ngOnInit() {
    const vehicleId : number = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getVehicleById(vehicleId).subscribe((response) => {
     this.vehicle = response;
    })
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

}
