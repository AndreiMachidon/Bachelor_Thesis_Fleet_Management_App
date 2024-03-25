import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mark-alert-resolved-dialog',
  templateUrl: './mark-alert-resolved-dialog.component.html',
  styleUrls: ['./mark-alert-resolved-dialog.component.css']
})
export class MarkAlertResolvedDialogComponent {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MarkAlertResolvedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      costs: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  formatAlertType(alertType: string): string {
    switch (alertType) {
        case 'VEHICLE_BREAKDOWN':
          return 'Vehicle Breakdown';
        case 'TRAFFIC_JAM':
          return 'Traffic Jam';
        case 'ACCIDENT_REPORT':
          return 'Accident Report';
        default:
          return 'Road alert';
    }

  }
}

