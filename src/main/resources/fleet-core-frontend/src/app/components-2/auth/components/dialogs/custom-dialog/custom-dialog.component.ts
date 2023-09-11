import { Component, Inject } from '@angular/core';
import{ MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-custom-register-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent {

  dialogMainHeader: string;
  dialogHeader: string;
  dialogText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(){
    this.dialogMainHeader = this.data.dialogMainHeader;
    this.dialogHeader = this.data.dialogHeader;
    this.dialogText = this.data.dialogText;
  }
}
