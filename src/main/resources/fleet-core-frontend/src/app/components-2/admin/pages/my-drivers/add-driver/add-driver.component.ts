import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { MyDriversService } from '../services/my-drivers-service.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { formatNumber } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent {

  fileName: string = '';
  uploadedImage: any = null;

  constructor(private driverSerice: MyDriversService, private authService: AuthService, private router : Router){};

  addDriverFormGroup = new FormGroup({
    firstNameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    phoneNumberFormControl: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    ratePerKilometerFormControl: new FormControl('', [Validators.required]),
    licenseExpiryDateFormControl: new FormControl('', [Validators.required]),
    yearsOfExperienceFormControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    totalKilometersDrivenFormControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    imageDataFromControl: new FormControl('', [this.fileTypeValidator(['png', 'jpg'])])
});


addDriver() {
      const imageData: File | any = this.addDriverFormGroup.get('imageDataFromControl').value;

       if (imageData instanceof File) {
       this.getBase64(imageData).then(data => {

        if (data && data.startsWith('data:image/jpeg;base64,')) {
            data = data.split('data:image/jpeg;base64,')[1];
        }

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
          imageData: data,
          organisationName: this.authService.getUserDetails().organisationName
      };

      const adminId: number = this.authService.getUserDetails().id;

      this.driverSerice.registerDriver(adminId, driver).subscribe((response) => {
        console.log(response);
        
        this.router.navigate(['admin-dashboard/my-drivers']);
      });
    })
  }
}


  
    

  fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.').pop();
        if (allowedTypes.includes(extension.toLowerCase())) {
          return null;
        } else {
          return {'invalidFileType': {value: control.value}};
        }
      }
      return null;
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (['png', 'jpg'].includes(extension)) {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImage = e.target.result;
          this.addDriverFormGroup.get('imageDataFromControl').setValue(file);
        };
        reader.readAsDataURL(file);
      } else {
        this.addDriverFormGroup.get('imageDataFromControl').setErrors({'invalidFileType': true});
        this.addDriverFormGroup.get('imageDataFromControl').setValue(null);
        this.uploadedImage = null;
        this.fileName = '';

        alert('Invalid file type. Only PNG and JPG are allowed.');
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
  



}
