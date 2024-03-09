import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
    const token = this.authService.getAuthToken();
    this.httpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer ' + token)
  }

  public getUpcomingRoutes(driverId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/drivers/upcomingRoutes?driverId=${driverId}`, { 'headers': this.httpHeaders });
  }

  
}
