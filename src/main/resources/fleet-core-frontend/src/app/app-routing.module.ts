import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//auth components
import { LoginPageComponent } from './components-2/auth/pages/login-page/login-page.component';
import { ForgotPasswordPageComponent } from './components-2/auth/pages/forgot-password-page/forgot-password-page.component';
import { RegisterPageComponent } from './components-2/auth/pages/register-page/register-page.component';
import { AdminDashboardComponent } from './components-2/admin/admin-dashboard/admin-dashboard.component';
import { MyFleetComponent } from './components-2/admin/pages/my-fleet/my-fleet.component';
import { MyDriversComponent } from './components-2/admin/pages/my-drivers/my-drivers.component';
import { RoutesComponent } from './components-2/admin/pages/routes/routes.component';
import { DashboardComponent } from './components-2/admin/pages/dashboard/dashboard.component';
import { AddVehicleComponent } from './components-2/admin/pages/my-fleet/add-vehicle/add-vehicle.component';
import { AddDriverComponent } from './components-2/admin/pages/my-drivers/add-driver/add-driver.component';
import { VehicleDetailsComponent } from './components-2/admin/pages/my-fleet/vehicle-details/vehicle-details.component';
import { DriverDetailsComponent } from './components-2/admin/pages/my-drivers/driver-details/driver-details.component';
import { DriverHomeComponent } from './components-2/driver/driver-home/driver-home.component';
import { SeeDriverRoutesComponent } from './components-2/driver/pages/see-driver-routes/see-driver-routes.component';
import { NavigateRouteComponent } from './components-2/driver/pages/navigate-route/navigate-route.component';
import { DriverMainComponent } from './components-2/driver/driver-main/driver-main.component';
import { AuthGuardAdmin } from './components-2/auth/auth-guards/auth-guard-admin';
import { AuthGuardDriver } from './components-2/auth/auth-guards/auth-guard-driver';
import { AuthGuardRedirectExistingUser } from './components-2/auth/auth-guards/auth-guard-redirect-existing-user';

const routes: Routes = [
  { path: '', component: LoginPageComponent, canActivate: [AuthGuardRedirectExistingUser] },
  { path: 'register', component: RegisterPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuardAdmin],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-fleet', component: MyFleetComponent },
      { path: 'my-drivers', component: MyDriversComponent },
      { path: 'routes', component: RoutesComponent },
      {path: 'add-vehicle', component: AddVehicleComponent},
      {path: 'add-driver', component: AddDriverComponent},
      {path: 'vehicle-details/:id', component: VehicleDetailsComponent},
      {path: 'driver-details/:id', component: DriverDetailsComponent}
    ],
  },
  {
    path: 'driver-home',
    component: DriverMainComponent,
    canActivate: [AuthGuardDriver],
    children: [
      {path: '', component: DriverHomeComponent},
      {path: 'routes', component: SeeDriverRoutesComponent },
      {path: 'route-navigation/:id', component: NavigateRouteComponent}
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
