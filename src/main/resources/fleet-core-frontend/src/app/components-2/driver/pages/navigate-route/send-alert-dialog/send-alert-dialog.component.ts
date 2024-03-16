import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouteAlertDto } from 'src/app/components-2/admin/pages/routes/dto/route-alert-dto.model';

@Component({
  selector: 'app-send-alert-dialog',
  templateUrl: './send-alert-dialog.component.html',
  styleUrls: ['./send-alert-dialog.component.css']
})
export class SendAlertDialogComponent {

  constructor(public dialogRef: MatDialogRef<SendAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  alertTypes = [
    { value: 'VEHICLE_BREAKDOWN', viewValue: 'Vehicle Breakdown' },
    { value: 'TRAFFIC_JAM', viewValue: 'Traffic Jam' },
    { value: 'ACCIDENT_REPORT', viewValue: 'Accident Report' },
  ];

  sendAlertFormGroup = new FormGroup({
    alertTypeFormControl: new FormControl('', [Validators.required]),
    alertDescriptionFormControl: new FormControl('', [Validators.required]),
  });

  cancelSendAlert(){
    this.dialogRef.close();
  }

  sendAlert(){
    const alertDto: RouteAlertDto = {
      id: null,
      alertType: this.sendAlertFormGroup.value.alertTypeFormControl,
      alertDescription: this.sendAlertFormGroup.value.alertDescriptionFormControl,
      alertIssuedDate: new Date(),
      alertResolvedDate: null,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      alertStatus: 'UNRESOLVED',
      costs: 0,
      routeId: this.data.routeId
    };
    this.dialogRef.close(alertDto);
  }

}
