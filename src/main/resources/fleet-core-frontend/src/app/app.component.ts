import { Component } from '@angular/core';
import { TestServiceService } from './services/test-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  greeting: string = '';

  constructor(private testService: TestServiceService){}


  ngOnInit(){
      this.testService.getGreetings().subscribe((response) => {
        this.greeting = response;
      })
  }
}
