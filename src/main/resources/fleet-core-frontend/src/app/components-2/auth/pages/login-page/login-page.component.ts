import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignInDto } from '../../dto/SignInDto';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../dto/UserDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {

  hidePassword: boolean = true;
  emailNotFound: boolean = false;
  incorrectPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router){}

  loginFormGroup = new FormGroup({
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl('', [Validators.required])
  });

  loginUser(){
    if(this.loginFormGroup.valid){

      const signInDto: SignInDto = new SignInDto();

      signInDto.email = this.loginFormGroup.value.emailFormControl;
      signInDto.password = this.loginFormGroup.value.passwordFormControl;
      this.authService.login(signInDto)
      .subscribe((response: UserDto) => {
        if (response) {
          console.log('Login successful:', response);
          this.authService.setAuthToken(response.token);
          const role = this.authService.getUserDetails().role;
          if(role === 'admin'){
            this.router.navigate(['admin-dashboard']);
          }else if(role === 'driver')
            this.router.navigate(['driver-home']);
        } else {
          console.log('Login failed.');
          this.loginFormGroup.reset();
          this.emailNotFound = false;
          this.incorrectPassword = false;
        }
      },
      (error) => {
        if (error.status === 404) {
          console.log('Email not found');
          this.emailNotFound = true;
          this.incorrectPassword = false;
        } else if(error.status === 400){
          console.log("Incorrect Password");
          this.emailNotFound = false;
          this.incorrectPassword = true;
        }
      });

    }
  }
}
