import { formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Admin } from 'src/app/components-2/auth/dto/Admin';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { EditDetailsDialogComponent } from './dialogs/edit-details-dialog/edit-details-dialog.component';

@Component({
  selector: 'app-edit-account-details',
  templateUrl: './edit-account-details.component.html',
  styleUrls: ['./edit-account-details.component.css']
})
export class EditAccountDetailsComponent {
  fileName: string = '';
  uploadedImage: any = null;
  uploadedFile: File | null = null;
  today: Date = new Date();
  userDetails: any = null;

  hidePassword: boolean= true;
  hideConfirmPassword: boolean = true;

  constructor(private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { };

    ngOnInit() {
      this.userDetails = this.authService.getUserDetails();
      this.editAccountFormGroup.patchValue({
        firstNameFormControl: this.userDetails.firstName,
        lastNameFormControl: this.userDetails.lastName,
        phoneNumberFormControl: this.userDetails.phoneNumber,
        emailFormControl: this.userDetails.email,
        passwordFormControl: '',
        confirmPasswordFormControl: ''
      });
      this.authService.getImageData(this.userDetails.id).subscribe(
        data => {
          if(data) {
            this.uploadedImage = 'data:image/jpeg;base64,' + data;
          }
        },
      );
    }

  editAccountFormGroup = new FormGroup({
    firstNameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    phoneNumberFormControl: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', []),
    confirmPasswordFormControl: new FormControl('', [this.PasswordMatchValidator])
  });

  updateAccount() {
    if (!this.editAccountFormGroup.valid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    if (this.uploadedFile) {
      this.getBase64(this.uploadedFile).then(base64Data => {
        const imageDataBase64 = base64Data ? base64Data.split(',')[1] : null;
        this.createAndSendUserObject(imageDataBase64);
      }).catch(error => {
        console.error('Error processing image', error);
        this.snackBar.open('Error processing the image', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    } else {
      this.createAndSendUserObject(null);
    }
  }


  createAndSendUserObject(imageData: string | null) {
    const user: any = {
        id: this.userDetails.id,
        firstName: this.editAccountFormGroup.get('firstNameFormControl').value,
        lastName: this.editAccountFormGroup.get('lastNameFormControl').value,
        phoneNumber: this.editAccountFormGroup.get('phoneNumberFormControl').value,
        email: this.editAccountFormGroup.get('emailFormControl').value,
        role: this.userDetails.role,
        imageData: imageData,
        organisationName: this.userDetails.organisationName,
        password: this.editAccountFormGroup.get('passwordFormControl').value,
        driverDetailsId: null
    };

    const dialogRef = this.dialog.open(EditDetailsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Edit'){
        this.authService.updateUser(user).subscribe((response: any) => {
            this.authService.signOut();
        });
      }});
}


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg'].includes(extension)) {
            this.fileName = file.name;
            this.uploadedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.uploadedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            this.uploadedImage = null;
            this.fileName = '';
            this.snackBar.open('Invalid file type. Only PNG, JPG, and JPEG files are supported.', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        }
    }
}

  getBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }


  PasswordMatchValidator(control: AbstractControl) {
    const password = control.root.get('passwordFormControl')?.value;
    const repeatPassword = control.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }


}
