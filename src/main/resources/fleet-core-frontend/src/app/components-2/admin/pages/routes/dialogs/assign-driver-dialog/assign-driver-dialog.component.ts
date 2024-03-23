import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../../../my-drivers/services/my-drivers-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-assign-driver-dialog',
  templateUrl: './assign-driver-dialog.component.html',
  styleUrls: ['./assign-driver-dialog.component.css'],
})
export class AssignDriverDialogComponent {

  dataSource = new MatTableDataSource<Driver>;
  columnsToDisplay = ['driverIcon', 'firstName', 'lastName', 'ratePerKilometer', 'licenseExpiryDate', 'yearsOfExperience', 'totalKilometersDriven', 'actions'];
  expandedElement: Driver | null;


  constructor(private driverService: MyDriversService,
              public dialogRef: MatDialogRef<AssignDriverDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(){
    this.getAvailableDrivers();
  }

  getAvailableDrivers() {
    this.driverService.getAvailableDrivers(this.data.adminId, this.data.startTime, this.data.arrivalTime).subscribe(
      (response: Driver[]) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectDriver(row: Driver){
    this.dialogRef.close(row);
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }


}
