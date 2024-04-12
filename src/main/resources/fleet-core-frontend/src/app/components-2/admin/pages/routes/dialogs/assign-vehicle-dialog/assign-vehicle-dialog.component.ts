import { Component, Inject } from '@angular/core';
import { VehicleService } from '../../../my-fleet/services/vehicle-service.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Vehicle } from 'src/app/components-2/admin/admin-dashboard/models/vehicle.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-assign-vehicle-dialog',
  templateUrl: './assign-vehicle-dialog.component.html',
  styleUrls: ['./assign-vehicle-dialog.component.css'],
})
export class AssignVehicleDialogComponent {

  dataSource = new MatTableDataSource<Vehicle>;
  columnsToDisplay = ['vehicleIcon', 'make', 'model', 'milenage', 'fuelType', 'fuelConsumption', 'cargoCapacity', 'actions'];
  expandedElement: Vehicle | null;


  constructor(private vehicleService: VehicleService,
              public dialogRef: MatDialogRef<AssignVehicleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(){
    this.getAvailableVehicles();
  }

  getAvailableVehicles() {
    this.vehicleService.getAvailableVehicles(this.data.adminId, this.data.startTime, this.data.arrivalTime).subscribe(
      (response: Vehicle[]) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        console.error(error);
        
      }
    );
  }

  getFuelConsumptionUnit(row: Vehicle): string {
    if (row.fuelType.trim().toUpperCase() === 'ELECTRIC') {
        return 'kWh/100km';
    } else {
        return 'L/100km';
    }

  }

  selectVehicle(row: Vehicle){
    this.dialogRef.close(row);
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  formatCargoCapacity(cargoCapacity: number): string {
    return formatNumber(cargoCapacity, 'de', '1.0-0');
  }
}
