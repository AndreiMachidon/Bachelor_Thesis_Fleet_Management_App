import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../admin-dashboard/models/vehicle.model';
import { VehicleService } from './services/vehicle-service.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteVehicleDialogComponent } from './dialogs/delete-vehicle-dialog/delete-vehicle-dialog.component';

@Component({
  selector: 'app-my-fleet',
  templateUrl: './my-fleet.component.html',
  styleUrls: ['./my-fleet.component.css']
})
export class MyFleetComponent implements OnInit{
  
    vehicles: Vehicle[]
    selectedVehicles: Vehicle[] = [];
    currentFilter: string = 'ALL'

    constructor(private vehicleService: VehicleService, private authService: AuthService, private router: Router, public dialog: MatDialog){}

    ngOnInit(){
      this.refreshVehicles()
    }


    refreshVehicles(){
      const idAdmin = this.authService.getUserDetails().id;
      this.vehicleService.getAllVehicles(idAdmin).subscribe((response) => {
        this.vehicles = response;
      })
    }

    onVehicleSelected(event: {vehicle: Vehicle, selected: boolean}) {
      if (event.selected) {
        this.selectedVehicles.push(event.vehicle);
      } else {
        const index = this.selectedVehicles.indexOf(event.vehicle);
        if (index > -1) {
          this.selectedVehicles.splice(index, 1);
        }
      }
    }

    deleteSelectedVehicles() {

      const dialogRef = this.dialog.open(DeleteVehicleDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if(result === 'Delete'){
          const selectedIds: number[] = this.selectedVehicles.map(vehicle => vehicle.id);
          this.vehicleService.deleteVehicles(selectedIds).subscribe((response) => {  
            window.location.reload();
            this.selectedVehicles = []
          })
        
        }
      });
    }

    addVehicle(){
      this.router.navigate(["admin-dashboard/add-vehicle"]);
    }

;

    setFilter(filter: string) {
      this.currentFilter = filter;
    }

    get filteredVehicles() {
      if (this.currentFilter === 'ALL') {
      return this.vehicles;
    }
      return this.vehicles.filter(vehicle => vehicle.vehicleStatus === this.currentFilter);
  }
}
