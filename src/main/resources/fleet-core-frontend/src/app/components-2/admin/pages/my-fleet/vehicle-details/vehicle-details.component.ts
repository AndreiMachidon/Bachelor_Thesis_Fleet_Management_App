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
  isMaintenanceScheduled: boolean = false;
  isMaintenanceToday: boolean = false;
  isMaintenanceMandatory: boolean = false;
  monthsUntilNextMaintenance: number = 0;
  daysUntilNextMaintenance: number = 0;
  kilometersUntilNextMaintenance: number;
  nextMaintenance: Maintenance;

  constructor(private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe) { }

  ngOnInit() {
    const vehicleId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getVehicleById(vehicleId).subscribe(
      (vehicleResponse) => {
        this.vehicle = vehicleResponse;
        this.vehicleService.getLastMaintenance(vehicleId).subscribe(
          (maintenanceResponse) => {
            this.nextMaintenance = maintenanceResponse;
            this.checkMaintenanceRequirements(this.nextMaintenance);
          },
          (error) => {
            console.error(error);
            this.isMaintenanceMandatory = true;
          }
        );
      }
    );
  }

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  returnMain() {
    this.router.navigate(["admin-dashboard/my-fleet"]);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  formatScheduledMaintenanceType(maintenanceType: string): string {
    if (maintenanceType === 'BASIC_SAFETY_CHECK') {
      return "Basic Safety Check"
    } else if (maintenanceType === 'EMISSIONS_EFFICIENCY_SERVICE') {
      return 'Emissions Efficiency Service'
    } else if(maintenanceType === 'COMPREHENSIVE_MAINTENANCE_INSPECTION'){
      return 'Comprehensive Maintenance Inspection'
    }else{
      return "Maintenance"
    }
  }

  scheduleMaintenance() {
    const dialogRef = this.dialog.open(AddMaintenanceComponent, {
      data: this.vehicle,
      width: '1200px',
      height: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Save') {
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

  checkMaintenanceRequirements(lastMaintenance: Maintenance) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastMaintenanceDate = new Date(lastMaintenance.maintananceDate);
    lastMaintenanceDate.setHours(0, 0, 0, 0);

    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const kmSinceLastMaintenance = this.vehicle.milenage - lastMaintenance.currentVehicleMileage;

    this.isMaintenanceScheduled = lastMaintenanceDate >= today;
    this.isMaintenanceToday =
                            lastMaintenanceDate.getFullYear() === today.getFullYear() &&
                            lastMaintenanceDate.getMonth() === today.getMonth() &&
                            lastMaintenanceDate.getDate() === today.getDate();

    this.isMaintenanceMandatory = kmSinceLastMaintenance >= 20000 || lastMaintenanceDate <= sixMonthsAgo;

    if (!this.isMaintenanceMandatory && !this.isMaintenanceScheduled) {
      this.calculateTimeUntilNextMaintenance(lastMaintenanceDate);
      this.kilometersUntilNextMaintenance = 20000 - kmSinceLastMaintenance;
    }
  }

  calculateTimeUntilNextMaintenance(lastMaintenanceDate: Date) {
    const nextMaintenanceDate = new Date(lastMaintenanceDate);
    nextMaintenanceDate.setMonth(lastMaintenanceDate.getMonth() + 6);

    const today = new Date();
    const daysDifference = Math.ceil((nextMaintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference < 30) {
      this.daysUntilNextMaintenance = daysDifference;
      this.monthsUntilNextMaintenance = 0;
    } else {
      this.monthsUntilNextMaintenance = Math.floor(daysDifference / 30);
      this.daysUntilNextMaintenance = daysDifference % 30;
    }
  }



}

