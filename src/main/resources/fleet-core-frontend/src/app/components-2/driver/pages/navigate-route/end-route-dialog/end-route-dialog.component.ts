import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-end-route-dialog',
  templateUrl: './end-route-dialog.component.html',
  styleUrls: ['./end-route-dialog.component.css']
})
export class EndRouteDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<EndRouteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
}
