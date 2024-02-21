import { Component } from '@angular/core';
import { VehicleService } from '../../../my-fleet/services/vehicle-service.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Vehicle } from 'src/app/components-2/admin/admin-dashboard/models/vehicle.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-vehicle-dialog',
  templateUrl: './assign-vehicle-dialog.component.html',
  styleUrls: ['./assign-vehicle-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssignVehicleDialogComponent {

  dataSource = new MatTableDataSource<Vehicle>;
  columnsToDisplay = ['vehicleIcon', 'make', 'model', 'milenage', 'fuelType', 'fuelConsumption', 'cargoCapacity'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Vehicle | null;
  selection = new SelectionModel<Vehicle>(true, []);


  constructor(private vehicleService: VehicleService,
              private authService: AuthService,
              public dialogRef: MatDialogRef<AssignVehicleDialogComponent>) {}


  ngOnInit(){
    this.getAvailableVehicles();
  }

  getAvailableVehicles(){
    this.vehicleService.getAvailableVehicles(this.authService.getUserDetails().id).subscribe(
      (response : Vehicle[]) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        alert(error)
      }
    )
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
}
