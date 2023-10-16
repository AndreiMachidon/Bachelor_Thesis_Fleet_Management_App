import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { Vehicle } from '../../../admin-dashboard/models/vehicle.model';
import { API_URL } from 'src/app/contants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
  }

  public getAllVehicles(adminId: number) : Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(`${API_URL}/vehicles/all?id=${adminId}`,{ 'headers': this.httpHeaders });
  }

  public addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${API_URL}/vehicles/save`, vehicle, {headers: this.httpHeaders});
  }

  public deleteVehicles(vehiclesIds: number[]) {
    return this.http.delete(`${API_URL}/vehicles/delete`, {headers: this.httpHeaders, body: vehiclesIds} )
  }

  public getVehicleById(vehicleID: number): Observable<Vehicle>{
    return this.http.get<Vehicle>(`${API_URL}/vehicles/getVehicle?id=${vehicleID}`, { 'headers': this.httpHeaders })
  }
}
