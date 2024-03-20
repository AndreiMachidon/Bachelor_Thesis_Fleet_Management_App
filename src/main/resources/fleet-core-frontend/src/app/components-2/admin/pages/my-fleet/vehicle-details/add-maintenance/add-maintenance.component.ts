import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleDetailsComponent } from '../vehicle-details.component';
import { Vehicle } from 'src/app/components-2/admin/admin-dashboard/models/vehicle.model';
import { Maintenance } from 'src/app/components-2/admin/admin-dashboard/models/maintanance.model';
import { VehicleService } from '../../services/vehicle-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MAT_DATE_LOCALE } from '@angular/material/core';
@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ],
})
export class AddMaintenanceComponent {

  maintenance: Maintenance = new Maintenance();
  maintenanceTypes: string[] = ['BASIC_SAFETY_CHECK', 'EMISSIONS_EFFICIENCY_SERVICE', 'COMPREHENSIVE_MAINTENANCE_INSPECTION'];
  selectedMaintenanceType: string = '';
  selectedMaintananceDate: Date;
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public vehicle: Vehicle,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectMaintenanceType(type: string): void {
    this.selectedMaintenanceType = type;
  }

  setMaintenanceDate(date: Date): void {
    this.selectedMaintananceDate = date;
  }
  

  saveMaintenance(){

    if(this.selectedMaintenanceType !== '' && this.selectedMaintananceDate != undefined){
      this.maintenance.maintenanceType = this.selectedMaintenanceType;  
      this.maintenance.maintananceDate = this.selectedMaintananceDate
      this.maintenance.currentVehicleMileage = this.vehicle.milenage;
      if(this.selectedMaintenanceType == 'BASIC_SAFETY_CHECK'){
        this.maintenance.price = 250;
      }else if(this.selectedMaintenanceType == 'EMISSIONS_EFFICIENCY_SERVICE'){
        this.maintenance.price = 400;
      }else if(this.selectedMaintenanceType == 'COMPREHENSIVE_MAINTENANCE_INSPECTION'){
        this.maintenance.price = 800;
      }
      this.maintenance.vehicleId = this.vehicle.id;
  
      this.vehicleService.saveMaintenance(this.maintenance).subscribe((response) => {
        this.snackBar.open('Maintenance saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
      });
        this.dialogRef.close("Save"); 
      })
  
    }else{
      this.snackBar.open('Please select a Maintenance Type and a Date!', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
    });
    }
   

  }
}
