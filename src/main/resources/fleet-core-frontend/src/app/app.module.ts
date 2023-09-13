import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './components-2/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components-2/auth/pages/register-page/register-page.component';
import { ForgotPasswordPageComponent } from './components-2/auth/pages/forgot-password-page/forgot-password-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
    MatCardModule

  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
