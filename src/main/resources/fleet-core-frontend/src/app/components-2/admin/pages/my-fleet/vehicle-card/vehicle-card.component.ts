import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vehicle } from '../../../admin-dashboard/models/vehicle.model';
import { formatNumber } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.css']
})
export class VehicleCardComponent {

  @Input() vehicle : Vehicle;
  @Output() vehicleSelected = new EventEmitter<{vehicle: Vehicle, selected: boolean}>();


  constructor(private router: Router){};

  checked: boolean  = false
  formatEngineSize(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    const formattedValue = Math.floor(value);
    return `${formattedValue} L`;
  }

  getVehicleAvailabilityColor(status: string): string {
    switch (status) {
      case 'IDLE':
        return 'yellow';
      case 'ON_ROUTE':
        return 'green';
      case 'IN_SERVICE':
        return 'red';
      default:
        return 'yellow';
    }
  }

  formatVehicleStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());
  }

  onCheckboxChange() {
    this.vehicleSelected.emit({ vehicle: this.vehicle, selected: this.checked });
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  getVehicleDetails(){
    const vehicleId = this.vehicle.id;
    this.router.navigate(["admin-dashboard/vehicle-details", vehicleId]);
}

}
