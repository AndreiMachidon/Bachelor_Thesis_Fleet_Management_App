import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//auth components
import { LoginPageComponent } from './components-2/auth/pages/login-page/login-page.component';
import { ForgotPasswordPageComponent } from './components-2/auth/pages/forgot-password-page/forgot-password-page.component';
import { RegisterPageComponent } from './components-2/auth/pages/register-page/register-page.component';
import { AdminDashboardComponent } from './components-2/admin-dashboard/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent},
    {path: 'forgot-password', component: ForgotPasswordPageComponent},
    {path: 'admin-dashboard', component: AdminDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
