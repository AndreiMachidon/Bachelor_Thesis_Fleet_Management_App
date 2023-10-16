import { DatePipe, formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Vehicle } from '../../../admin-dashboard/models/vehicle.model';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { VehicleService } from '../services/vehicle-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddVehicleDialogComponent } from './dialogs/add-vehicle-dialog/add-vehicle-dialog.component';
import { CancelDialogComponent } from './dialogs/cancel-dialog/cancel-dialog.component';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})

export class AddVehicleComponent {

  generalDetilsFormGroup: FormGroup;
  technicalDetailsFormGroup: FormGroup;
  photoFormGroup: FormGroup;
  selectedYear: number;
  fileName: string = '';
  uploadedImage: any = null;
  selectedFuelType: string = '';

  ngOnInit(): void {
    this.generalDetilsFormGroup.get('fuelTypeControl').valueChanges.subscribe(selectedValue => {
        this.selectedFuelType = selectedValue;
    });
  }

getFuelCapacityUnit(): string {

  if (this.selectedFuelType.trim().toUpperCase() === 'ELECTRIC') {
    return 'kWh';
  } else {
    return 'Liters';
  }
}

getFuelConsumptionUnit(): string {
  if (this.selectedFuelType.trim().toUpperCase() === 'ELECTRIC') {
      return 'kWh/100km';
  } else {
      return 'L/100km';
  }
}

  transmisionTypes = [
    {value: 'AUTOMATIC', viewValue: 'Automatic'},
    {value: 'MANUAL', viewValue: 'Manual'}
  ];

  fuelTypes = [
    {value: 'DIESEL', viewValue: 'Diesel'},
    {value: 'GASOLINE', viewValue: 'Gasoline'},
    {value: 'ELECTRIC', viewValue: 'Electric'}
  ]

  selectedValue: string;

  get fuelTypeControl(): FormControl {
    return this.technicalDetailsFormGroup.get('fuelTypeControl') as FormControl;
  }


  constructor(private formBuilder: FormBuilder, 
              private datePipe: DatePipe, 
              private router : Router, 
              private authService: AuthService,
              private vehicleService: VehicleService,
              public dialog: MatDialog) {

    this.generalDetilsFormGroup = this.formBuilder.group({
      makeControl: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      modelControl: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      VINControl: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      lincesePlateControl: ['', [Validators.required]],
      milenageControl: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      fuelTypeControl: ['', Validators.required]
    });

    this.technicalDetailsFormGroup = this.formBuilder.group({
      yearOfManufactureControl: ['', [Validators.required]],
      cargoCapacityControl: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      fuelCapacityControl: ['', [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]+)?$")]],
      fuelConsumptionControl: ['', [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]+)?$")]],
    });

    this.photoFormGroup = this.formBuilder.group({
      imageData: ['', [this.fileTypeValidator(['png', 'jpg'])]]
    });  
  }

  yearChanged(event: Date, picker: MatDatepicker<Date>) {
    this.selectedYear = event.getFullYear();
    const firstDayOfYear = new Date(this.selectedYear, 0, 1);
    this.technicalDetailsFormGroup.get('yearOfManufactureControl').setValue(firstDayOfYear);
    picker.close();
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
          this.photoFormGroup.get('imageData').setValue(file);
        };
        reader.readAsDataURL(file);
      } else {
        this.photoFormGroup.get('imageData').setErrors({'invalidFileType': true});
        this.photoFormGroup.get('imageData').setValue(null);
        this.uploadedImage = null;
        this.fileName = '';

        alert('Invalid file type. Only PNG and JPG are allowed.');
      }
    }
  }

  clearImage() {
    this.technicalDetailsFormGroup.get('imageData').reset();
    this.uploadedImage = null;
    this.fileName = '';
  }

  onCancel() {
    const dialogRef = this.dialog.open(CancelDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Leave'){
        this.router.navigate(['admin-dashboard/my-fleet']);
      }
    });
}

  onSave() {
    const make: string = this.generalDetilsFormGroup.get('makeControl').value;
    const model: string = this.generalDetilsFormGroup.get('modelControl').value;
    const vin: string = this.generalDetilsFormGroup.get('VINControl').value;
    const lincesePlate: string = this.generalDetilsFormGroup.get('lincesePlateControl').value;
    const milenage: number = this.generalDetilsFormGroup.get('milenageControl').value;
    const fuelType: string = this.generalDetilsFormGroup.get('fuelTypeControl').value;

    const yearOfManufacture: number = this.technicalDetailsFormGroup.get('yearOfManufactureControl').value.getFullYear();
    const cargoCapacity: number =this.technicalDetailsFormGroup.get('cargoCapacityControl').value;
    const fuelCapacity: number = this.technicalDetailsFormGroup.get('fuelCapacityControl').value;
    const fuelConsumption: number = this.technicalDetailsFormGroup.get('fuelConsumptionControl').value;

    const imageData = this.photoFormGroup.get('imageData').value;

    const adminId: number = this.authService.getUserDetails().id;

    this.getBase64(imageData).then(data => {

      if (data && data.startsWith('data:image/jpeg;base64,')) {
          data = data.split('data:image/jpeg;base64,')[1];
      }

        const vehicle: Vehicle = {
            id: null,
            make: make,
            model: model,
            vin: vin,
            lincesePlate: lincesePlate,
            milenage: milenage,
            fuelType: fuelType,
            yearOfManufacture: yearOfManufacture,
            cargoCapacity: cargoCapacity,
            fuelCapacity: fuelCapacity,
            fuelConsumption: fuelConsumption,
            vehicleStatus: "IDLE",
            imageData: data,
            adminId: adminId
        };

        console.log(vehicle);
      
        this.vehicleService.addVehicle(vehicle).subscribe((response) => {
            this.dialog.open(AddVehicleDialogComponent);
        });

        this.router.navigate(['admin-dashboard/my-fleet']);

    }).catch(error => {
        console.error("Error converting image to base64:", error);
    });
}

  getYearFromDate(date: any): number {
    let parsedDate: Date;

    if (typeof date === 'string') {
      parsedDate = new Date(date);
    } else if (typeof date === 'number') {
    parsedDate = new Date(date);
    } else {
    parsedDate = date;
    }

    if (parsedDate instanceof Date) {
    return parsedDate.getFullYear();
    } else {
    return null;
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
