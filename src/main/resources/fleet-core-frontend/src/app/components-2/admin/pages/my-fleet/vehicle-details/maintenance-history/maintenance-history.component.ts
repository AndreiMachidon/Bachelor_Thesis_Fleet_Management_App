import { Component, Inject } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Maintenance } from 'src/app/components-2/admin/admin-dashboard/models/maintanance.model';
import { Vehicle } from 'src/app/components-2/admin/admin-dashboard/models/vehicle.model';
import { VehicleService } from '../../services/vehicle-service.service';
import { VehicleDetailsComponent } from '../vehicle-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'maintenance-history-component',
  styleUrls: ['maintenance-history.component.css'],
  templateUrl: 'maintenance-history.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaintenanceHistoryComponent {
  dataSource = new MatTableDataSource<Maintenance>
  columnsToDisplay = ['type', 'date', 'vehicleMilenage', 'price'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Maintenance | null;

  constructor(public dialogRef: MatDialogRef<VehicleDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public vehicle: Vehicle,
              private vehicleService: VehicleService) {}

  ngOnInit(){
    this.vehicleService.getAllMaintanancesForVehicle(this.vehicle.id).subscribe(
      (response : Maintenance[]) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        alert(error)
      }
    )
  }
}

