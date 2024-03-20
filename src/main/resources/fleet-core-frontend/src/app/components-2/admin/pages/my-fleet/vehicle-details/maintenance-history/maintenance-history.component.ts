import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Maintenance } from 'src/app/components-2/admin/admin-dashboard/models/maintanance.model';
import { Vehicle } from 'src/app/components-2/admin/admin-dashboard/models/vehicle.model';
import { VehicleService } from '../../services/vehicle-service.service';
import { VehicleDetailsComponent } from '../vehicle-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'maintenance-history-component',
  styleUrls: ['maintenance-history.component.css'],
  templateUrl: 'maintenance-history.component.html',
})
export class MaintenanceHistoryComponent {
  dataSource = new MatTableDataSource<Maintenance>
  columnsToDisplay = ['maintenanceType', 'maintananceDate', 'currentVehicleMileage', 'price'];

  constructor(public dialogRef: MatDialogRef<VehicleDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public vehicle: Vehicle,
              private vehicleService: VehicleService) {}

  ngOnInit(){
    this.vehicleService.getAllMaintanancesForVehicle(this.vehicle.id).subscribe(
      (response : Maintenance[]) => {
        console.log(response);
        
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        alert(error)
      }
    )
  }

  
  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  convertMaintenanceTypeToString(maintenanceType: string){
    switch(maintenanceType){
      case 'BASIC_SAFETY_CHECK':
        return 'Basic Safety Check';
      case 'EMISSIONS_EFFICIENCY_SERVICE':
        return 'Emissions Efficiency Service';
      case 'COMPREHENSIVE_MAINTENANCE_INSPECTION':
        return 'Comprehensive Maintenance Inspection';
      default:
        return 'Maintenance';
    }
  }

}

