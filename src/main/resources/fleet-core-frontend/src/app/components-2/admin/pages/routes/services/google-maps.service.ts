import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { API_URL } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
    const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
  }

  public getRoute(origin: string, destination: string) {
    return this.http.get(`${API_URL}/maps/directions?origin=${origin}&destination=${destination}`)
  }
}
