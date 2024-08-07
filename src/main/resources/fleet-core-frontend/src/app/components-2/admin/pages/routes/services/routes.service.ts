import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { RouteDto } from '../dto/route-dto.model';
import { API_URL } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
  }

  public saveRoute(route: RouteDto):  Observable<RouteDto>{
    return this.http.post<RouteDto>(`${API_URL}/routes/save`, route, { 'headers': this.httpHeaders });
  }

  public getAll(adminId: number): Observable<RouteDto[]>{
    return this.http.get<RouteDto[]>(`${API_URL}/routes/all?adminId=${adminId}`, { 'headers': this.httpHeaders });
  }

  public getByRouteId(routeId: number): Observable<any>{
    return this.http.get(`${API_URL}/routes/findById?routeId=${routeId}`, { 'headers': this.httpHeaders });
  }

  public updateRouteStatus(routeId: number, routeStatus: string): Observable<any>{
    return this.http.patch(`${API_URL}/routes/updateStatus?routeId=${routeId}&status=${routeStatus}`, null, { 'headers': this.httpHeaders, responseType: 'text' });
  }

  

}
