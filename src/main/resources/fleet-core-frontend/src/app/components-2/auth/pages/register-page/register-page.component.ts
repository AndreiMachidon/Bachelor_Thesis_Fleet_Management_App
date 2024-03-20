import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { SignUpDto } from '../../dto/SignUpDto';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { CustomDialogComponent} from '../../components/dialogs/custom-dialog/custom-dialog.component';
import { Router } from '@angular/router';
import { UserDto } from '../../dto/UserDto';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  constructor(private authService: AuthService, public dialog: MatDialog, private router: Router){}

  hidePassword: boolean= true;
  hideConfirmPassword: boolean = true;

  registerFormGroup = new FormGroup({
    organisationFormControl: new FormControl('', [Validators.required]),
    firstNameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    phoneNumberFormControl: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required]),
    confirmPasswordFormControl: new FormControl('', [Validators.required, this.PasswordMatchValidator])
  });

  PasswordMatchValidator(control: AbstractControl) {
    const password = control.root.get('passwordFormControl')?.value;
    const repeatPassword = control.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  registerUserFormSubmit(){
    if (this.registerFormGroup.valid) {
      const signUpDto: SignUpDto = new SignUpDto();
      signUpDto.organisationName = this.registerFormGroup.value.organisationFormControl;
      signUpDto.firstName = this.registerFormGroup.value.firstNameFormControl;
      signUpDto.lastName = this.registerFormGroup.value.lastNameFormControl;
      signUpDto.phoneNumber = this.registerFormGroup.value.phoneNumberFormControl;
      signUpDto.email = this.registerFormGroup.value.emailFormControl;
      signUpDto.password = this.registerFormGroup.value.passwordFormControl;
      signUpDto.role = "admin";
  
      this.authService.register(signUpDto)
        .pipe(
          catchError((error) => {
            return of(null);
          })
        )
        .subscribe((response: UserDto) => {
          if (response) {
            this.authService.setAuthToken(response.token);

            this.openSuccessfulDialog();
          } else {
            this.openErrorDialog();
            this.registerFormGroup.reset();
          }
        });
    }

  }

  openSuccessfulDialog() {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        dialogMainHeader: "Successful Registration!",
        dialogHeader: "Admin sucesfully registered!",
        dialogText: "You can now log in with this credentials via the Sign in page"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['']);
      this.registerFormGroup.reset();
    });
  }

  openErrorDialog() {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        dialogMainHeader: "Registration Error!",
        dialogHeader: "Error while registering the organisation!",
        dialogText: "There is already a user with this email"
      }
    });
  }
}
