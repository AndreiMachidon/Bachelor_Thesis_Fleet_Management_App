import { Component } from '@angular/core';
import { MyDriversService } from './services/my-drivers-service.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-drivers',
  templateUrl: './my-drivers.component.html',
  styleUrls: ['./my-drivers.component.css']
})
export class MyDriversComponent {

  drivers: Driver[];

  constructor(private driversService: MyDriversService,
              private authService: AuthService,
              private router: Router){}

  ngOnInit(){
    this.driversService.getAllDriversForAdmin(this.authService.getUserDetails().id).subscribe((response) => {
      console.log(response);   
      this.drivers = response;
      
    })
  }

  addDriver(){
    this.router.navigate(["admin-dashboard/add-driver"]);
  }
}
