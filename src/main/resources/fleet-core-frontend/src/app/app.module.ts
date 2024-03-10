import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './components-2/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components-2/auth/pages/register-page/register-page.component';
import { ForgotPasswordPageComponent } from './components-2/auth/pages/forgot-password-page/forgot-password-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//locales
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeDe);



//angular material
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { CustomDialogComponent } from './components-2/auth/components/dialogs/custom-dialog/custom-dialog.component';
import { FailedRegisterDialogComponent } from './components-2/auth/components/dialogs/failed-register-dialog/failed-register-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AdminDashboardComponent } from './components-2/admin/admin-dashboard/admin-dashboard.component'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './components-2/admin/admin-dashboard/toolbar/toolbar.component'; 
import { SidenavComponent } from './components-2/admin/admin-dashboard/sidenav/sidenav.component'; 
import { UerDetailsComponent } from './components-2/admin/admin-dashboard/toolbar/uer-details/uer-details.component';
import { MyFleetComponent } from './components-2/admin/pages/my-fleet/my-fleet.component';
import { MyDriversComponent } from './components-2/admin/pages/my-drivers/my-drivers.component';
import { RoutesComponent } from './components-2/admin/pages/routes/routes.component';
import { DashboardComponent } from './components-2/admin/pages/dashboard/dashboard.component'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VehicleCardComponent } from './components-2/admin/pages/my-fleet/vehicle-card/vehicle-card.component';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddVehicleComponent } from './components-2/admin/pages/my-fleet/add-vehicle/add-vehicle.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { AddVehicleDialogComponent } from './components-2/admin/pages/my-fleet/add-vehicle/dialogs/add-vehicle-dialog/add-vehicle-dialog.component';
import { CancelDialogComponent } from './components-2/admin/pages/my-fleet/add-vehicle/dialogs/cancel-dialog/cancel-dialog.component';
import { DeleteVehicleDialogComponent } from './components-2/admin/pages/my-fleet/dialogs/delete-vehicle-dialog/delete-vehicle-dialog.component';
import {MatChipsModule} from '@angular/material/chips';
import { DriverCardComponent } from './components-2/admin/pages/my-drivers/driver-card/driver-card.component';
import { AddDriverComponent } from './components-2/admin/pages/my-drivers/add-driver/add-driver.component';
import { VehicleDetailsComponent } from './components-2/admin/pages/my-fleet/vehicle-details/vehicle-details.component';
import { AddMaintenanceComponent } from './components-2/admin/pages/my-fleet/vehicle-details/add-maintenance/add-maintenance.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MaintenanceHistoryComponent } from './components-2/admin/pages/my-fleet/vehicle-details/maintenance-history/maintenance-history.component';
import {MatTableModule} from '@angular/material/table';
import { DriverDetailsComponent } from './components-2/admin/pages/my-drivers/driver-details/driver-details.component';
import { AssignVehicleDialogComponent } from './components-2/admin/pages/routes/dialogs/assign-vehicle-dialog/assign-vehicle-dialog.component';
import { AssignDriverDialogComponent } from './components-2/admin/pages/routes/dialogs/assign-driver-dialog/assign-driver-dialog.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { SaveFinalRouteDialogComponent } from './components-2/admin/pages/routes/dialogs/save-final-route-dialog/save-final-route-dialog.component';
import { RouteWaypointsStepperComponent } from './components-2/admin/pages/routes/components/route-waypoints-stepper/route-waypoints-stepper.component';
import { RouteDetailsCardComponent } from './components-2/admin/pages/routes/components/route-details-card/route-details-card.component';
import { DriverHomeComponent } from './components-2/driver/driver-home/driver-home.component';
import { DriverHeaderComponent } from './components-2/driver/components/driver-header/driver-header.component';
import { SeeDriverRoutesComponent } from './components-2/driver/pages/see-driver-routes/see-driver-routes.component';
import { UpcomingRouteCardComponent } from './components-2/driver/components/upcoming-route-card/upcoming-route-card.component';
import { NavigateRouteComponent } from './components-2/driver/pages/navigate-route/navigate-route.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPasswordPageComponent,
    CustomDialogComponent,
    FailedRegisterDialogComponent,
    AdminDashboardComponent,
    ToolbarComponent,
    SidenavComponent,
    UerDetailsComponent,
    MyFleetComponent,
    MyDriversComponent,
    RoutesComponent,
    DashboardComponent,
    VehicleCardComponent,
    AddVehicleComponent,
    AddVehicleDialogComponent,
    CancelDialogComponent,
    DeleteVehicleDialogComponent,
    DriverCardComponent,
    AddDriverComponent,
    VehicleDetailsComponent,
    AddMaintenanceComponent,
    MaintenanceHistoryComponent,
    DriverDetailsComponent,
    AssignVehicleDialogComponent,
    AssignDriverDialogComponent,
    SaveFinalRouteDialogComponent,
    RouteWaypointsStepperComponent,
    RouteDetailsCardComponent,
    DriverHomeComponent,
    DriverHeaderComponent,
    SeeDriverRoutesComponent,
    UpcomingRouteCardComponent,
    NavigateRouteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTableModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
  ],
  
  providers: [DatePipe, 
            { provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
