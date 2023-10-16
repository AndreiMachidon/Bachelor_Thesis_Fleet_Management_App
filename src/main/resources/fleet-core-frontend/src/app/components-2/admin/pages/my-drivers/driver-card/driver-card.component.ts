import { DatePipe, formatNumber } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Driver } from 'src/app/components-2/auth/dto/Driver';

@Component({
  selector: 'driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.css']
})
export class DriverCardComponent {
    @Input() driver: Driver;

    constructor(private datePipe: DatePipe) { }

    formatDate(date: Date): string {
      return this.datePipe.transform(date, 'dd/MM/yyyy');
    }

    formatKilometers(milenage: number): string {
      return formatNumber(milenage, 'de', '1.0-0');
    }
}
