import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../admin-dashboard/models/vehicle.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle-service.service';
import { formatNumber, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddMaintenanceComponent } from './add-maintenance/add-maintenance.component';
import { Maintenance } from '../../../admin-dashboard/models/maintanance.model';
import { MaintenanceHistoryComponent } from './maintenance-history/maintenance-history.component';


@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent {

  vehicle: Vehicle;
  isMaintenanceScheduled : boolean;
  isMaintenanceToday: boolean;
  isMaintenanceMandatory :boolean;
  monthsUntilNextMaintenance: number = 0;
  daysUntilNextMaintenance: number;
  kilometersUntilNextMaintenance: number;
  nextMaintenance: Maintenance;

  constructor(private route: ActivatedRoute, 
              private vehicleService: VehicleService, 
              private router : Router,
              public dialog: MatDialog,
              private datePipe: DatePipe) { }

  ngOnInit() {
    const vehicleId : number = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getVehicleById(vehicleId).subscribe(
      (response) => {
          this.vehicle = response;
          this.vehicleService.getLastMaintenance(vehicleId).subscribe(
                (response : Maintenance) => { 
                    this.nextMaintenance = response;
                    this.handleIncomingMaintenance(this.nextMaintenance)
                },

                (error) => {
                    if(error.status == 400){
                    this.isMaintenanceMandatory = true;
                }
              }
          )
    })
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  returnMain(){
    this.router.navigate(["admin-dashboard/my-fleet"]);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  formatScheduledMaintenanceType(maintenanceType: string): string{
    if(maintenanceType === 'BASIC_SERVICE'){
      return "Basic service"
    }else if(maintenanceType === 'INTERMEDIATE_INSPECTION'){
      return 'Intermidiate inspection'
    }else{
      return 'Annual full inspection'
    }
  }

  scheduleMaintenance(){
    const dialogRef = this.dialog.open(AddMaintenanceComponent, {
      data: this.vehicle,
      width: '1200px',
      height: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Save'){
        window.location.reload();
      }
     
    });
  }

  viewMaintenanceHistory() {
    const dialogRef = this.dialog.open(MaintenanceHistoryComponent, {
      data: this.vehicle,
      width: '1200px',
      height: '700px'
    });

  }

  handleIncomingMaintenance(maintenance : Maintenance){
    const maintenanceDate: Date = new Date(maintenance.maintananceDate);
    const currentDate: Date = new Date(); 
    maintenanceDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    if (maintenanceDate > currentDate) {
        this.isMaintenanceScheduled = true;
        this.isMaintenanceToday = false;

    }else if (maintenanceDate < currentDate) {
        this.isMaintenanceScheduled = false;
        this.isMaintenanceToday = false;

        const nextMaintenanceDate: Date = new Date(maintenanceDate);
        nextMaintenanceDate.setMonth(maintenanceDate.getMonth() + 6);
    
        const daysDifference = Math.ceil((nextMaintenanceDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));    
          if (daysDifference < 30) {
            this.daysUntilNextMaintenance = daysDifference;
          } else {
            this.monthsUntilNextMaintenance = Math.floor(daysDifference / 30);
            const days = daysDifference % 30;
          }
    
        this.kilometersUntilNextMaintenance = 30000 - (this.vehicle.milenage - maintenance.currentVehicleMileage);
    
        if(this.kilometersUntilNextMaintenance < 0 || this.daysUntilNextMaintenance < 1) {
          this.isMaintenanceMandatory = true;
        } else {
          this.isMaintenanceMandatory = false;
        }

    } else {
        this.isMaintenanceScheduled = true;
        this.isMaintenanceToday = true;
    }
  }



}

