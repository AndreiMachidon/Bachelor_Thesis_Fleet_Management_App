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

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-fleet', component: MyFleetComponent },
      { path: 'my-drivers', component: MyDriversComponent },
      { path: 'routes', component: RoutesComponent },
      {path: 'add-vehicle', component: AddVehicleComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
