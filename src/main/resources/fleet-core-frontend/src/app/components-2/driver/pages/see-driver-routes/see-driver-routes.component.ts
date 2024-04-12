import { Component } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { WebSocketsService } from 'src/app/components-2/global-services/web-sockets.service';

@Component({
  selector: 'app-see-driver-routes',
  templateUrl: './see-driver-routes.component.html',
  styleUrls: ['./see-driver-routes.component.css']
})
export class SeeDriverRoutesComponent {

  upcomingRoutes: any[] = [];

  constructor(private driverService: DriverService, 
              private authService: AuthService,
              private webSocketService: WebSocketsService) { 

    this.driverService.getUpcomingRoutes(this.authService.getUserDetails().id).subscribe(data => {
      this.upcomingRoutes = data;
    })
  }

  ngOnInit(): void {
    this.webSocketService.initializeWebSocketConnection(this.authService.getAuthToken());
  }

}
