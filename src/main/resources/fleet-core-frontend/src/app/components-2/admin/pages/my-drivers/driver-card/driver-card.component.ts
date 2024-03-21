import { Component, Input } from '@angular/core';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../services/my-drivers-service.service';
import { Router } from '@angular/router';
import { formatNumber } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDriverDialogComponent } from '../dialogs/delete-driver-dialog/delete-driver-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.css']
})
export class DriverCardComponent {

  @Input() driver: Driver;

  constructor(private driversService: MyDriversService,
              private router: Router,
              private dialog: MatDialog) { }

  deleteDriver() {

    const dialogRef = this.dialog.open(DeleteDriverDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Delete'){
        this.driversService.deleteDriver(this.driver.id).subscribe(
          (response) => {
            window.location.reload();
          },
          (error) => {
            alert(error);
          }
        );
      }});
  }

  viewDriverDetails() {
    this.router.navigate(["admin-dashboard/driver-details", this.driver.id]);
    

  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

}
