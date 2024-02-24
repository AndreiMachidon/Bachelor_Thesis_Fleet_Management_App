import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { API_URL } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class MyDriversService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
  }

  public getAllDriversForAdmin(adminId: number):  Observable<Driver[]>{
    return this.http.get<Driver[]>(`${API_URL}/drivers/all?id=${adminId}`,{ 'headers': this.httpHeaders });
  }

  public registerDriver(adminId: number, driver: Driver): Observable<Driver>{
    return this.http.post<Driver>(`${API_URL}/register/driver?adminId=${adminId}`, driver, { 'headers': this.httpHeaders });
  }

  public deleteDriver(driverId: number): Observable<any>{
    return this.http.delete(`${API_URL}/drivers/delete/${driverId}`, { 'headers': this.httpHeaders, responseType: 'text' });
  }

  public getDriverDtoByDriverId(driverId: number): Observable<Driver>{
    return this.http.get<Driver>(`${API_URL}/drivers/getDriverByDriverId/${driverId}`, {'headers': this.httpHeaders})
  }

  public getAvailableDrivers(adminId: number, startTime: Date, arrivalTime: Date): Observable<Driver[]>{ 
    const params = new HttpParams()
      .set('id', adminId.toString())
      .set('startTime', startTime.toISOString())
      .set('arrivalTime', arrivalTime.toISOString());

    return this.http.get<Driver[]>(`${API_URL}/drivers/available`, {'headers': this.httpHeaders, params});
  }

}
