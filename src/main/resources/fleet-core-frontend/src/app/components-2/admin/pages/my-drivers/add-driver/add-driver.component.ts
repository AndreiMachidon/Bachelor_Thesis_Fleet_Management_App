import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../services/my-drivers-service.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { formatNumber } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddDriverDialogComponent } from '../dialogs/add-driver-dialog/add-driver-dialog.component';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent {

  fileName: string = '';
  uploadedImage: any = null;
  uploadedFile: File | null = null;
  today: Date = new Date();

  constructor(private driverSerice: MyDriversService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { };

  addDriverFormGroup = new FormGroup({
    firstNameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    phoneNumberFormControl: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    ratePerKilometerFormControl: new FormControl('', [Validators.required]),
    licenseExpiryDateFormControl: new FormControl('', [Validators.required]),
    yearsOfExperienceFormControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
  });

  addDriver() {
    if (!this.addDriverFormGroup.valid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    if (this.uploadedFile) {
      this.getBase64(this.uploadedFile).then(base64Data => {
        const imageDataBase64 = base64Data ? base64Data.split(',')[1] : null;
        this.createAndSendDriverObject(imageDataBase64);
      }).catch(error => {
        console.error('Error processing image', error);
        this.snackBar.open('Error processing the image', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    } else {
      this.createAndSendDriverObject(null);
    }
  }


  createAndSendDriverObject(imageData: string | null) {

    const driver: Driver = {
      id: null,
      firstName: this.addDriverFormGroup.get('firstNameFormControl').value,
      lastName: this.addDriverFormGroup.get('lastNameFormControl').value,
      phoneNumber: this.addDriverFormGroup.get('phoneNumberFormControl').value,
      email: this.addDriverFormGroup.get('emailFormControl').value,
      ratePerKilometer: parseFloat(this.addDriverFormGroup.get('ratePerKilometerFormControl').value),
      licenseExpiryDate: new Date(this.addDriverFormGroup.get('licenseExpiryDateFormControl').value),
      yearsOfExperience: parseInt(this.addDriverFormGroup.get('yearsOfExperienceFormControl').value),
      totalKilometersDriven: 0,
      role: 'driver',
      imageData: imageData,
      organisationName: this.authService.getUserDetails().organisationName
    };

    const adminId: number = this.authService.getUserDetails().id;

    this.driverSerice.registerDriver(adminId, driver).subscribe(
      (response) => {
        const dialogRef = this.dialog.open(AddDriverDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'Close') {
            this.router.navigate(['admin-dashboard/my-drivers']);
          }
        });
      },
      (error) => {
        if (error.status === 409) {
          this.snackBar.open('An user with this email already exists!', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
          );
        } else {
          this.snackBar.open('An error occurred while adding the driver!', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
          );
        }
      });
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

  formatMilenage(milenage: number): string {
    return formatNumber(milenage, 'de', '1.0-0');
  }

  cancelAddDriver() {
    this.router.navigate(['admin-dashboard/my-drivers']);
  }


}
