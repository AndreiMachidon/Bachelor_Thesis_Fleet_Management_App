import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { API_URL } from 'src/app/contants';
import { RouteAlertDto } from '../dto/route-alert-dto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteAlertService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
  }

  getRouteAlerts(routeId: number): Observable<RouteAlertDto[]>{
    return this.http.get<RouteAlertDto[]>(`${API_URL}/routes/alerts/all?routeId=` + routeId, {headers: this.httpHeaders});
  }

  saveRouteAlert(routeAlertDto: RouteAlertDto): Observable<any>{
    return this.http.post(`${API_URL}/routes/alerts/save`, routeAlertDto, {headers: this.httpHeaders, responseType: 'text'});
  }

  getCurrentUnresolvedRouteAlert(routeId: number): Observable<RouteAlertDto>{
    return this.http.get<RouteAlertDto>(`${API_URL}/routes/alerts/unresolved?routeId=` + routeId, {headers: this.httpHeaders});
  }

  markRouteAlertAsResolved(routeAlertId: number): Observable<any>{
    return this.http.patch(`${API_URL}/routes/alerts/markResolved?routeAlertId=` + routeAlertId, null, {headers: this.httpHeaders, responseType: 'text'});
  }

  
}
