import { Component } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';

@Component({
  selector: 'app-uer-details',
  templateUrl: './uer-details.component.html',
  styleUrls: ['./uer-details.component.css']
})
export class UerDetailsComponent {

  firstName: string;
  lastName: string;
  role: string;
  imageData: string;

  constructor(private authService: AuthService){};

  ngAfterContentInit(){
    this.firstName = this.authService.getUserDetails().firstName;
    this.lastName = this.authService.getUserDetails().lastName;
    const initialRole = this.authService.getUserDetails().role;
    this.role = initialRole.charAt(0).toUpperCase() + initialRole.slice(1);
    this.imageData = this.authService.getUserDetails().imageData;
    this.authService.getImageData(this.authService.getUserDetails().id).subscribe(
      data => {
        this.imageData = data;
        
      },
      error => {
      }
    );
    
  }
}
