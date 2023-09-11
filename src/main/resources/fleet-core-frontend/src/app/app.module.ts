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
import { AdminDashboardComponent } from './components-2/admin-dashboard/admin-dashboard/admin-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPasswordPageComponent,
    CustomDialogComponent,
    FailedRegisterDialogComponent,
    AdminDashboardComponent
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
    MatDialogModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
