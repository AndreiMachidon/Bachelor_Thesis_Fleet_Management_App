import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { Vehicle } from '../../../admin-dashboard/models/vehicle.model';
import { API_URL } from 'src/app/contants';
import { Observable } from 'rxjs';
import { Maintenance } from '../../../admin-dashboard/models/maintanance.model';

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

  public saveMaintenance(maintanance: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(`${API_URL}/maintenances/save`, maintanance, {headers: this.httpHeaders} )
  }

  public getLastMaintenance(vehicleId: number) : Observable<Maintenance> {
    return this.http.get<Maintenance>(`${API_URL}/maintenances/getLastMaintenance?vechileId=${vehicleId}`, {headers: this.httpHeaders})
  }

  public getAllMaintanancesForVehicle(vehicleId: number): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${API_URL}/maintenances/all?vehicleId=${vehicleId}`, {headers: this.httpHeaders})
  }

  public getAvailableVehicles(adminId: number, startTime: Date, arrivalTime: Date): Observable<Vehicle[]> {
    const params = new HttpParams()
      .set('id', adminId.toString())
      .set('startTime', startTime.toISOString())
      .set('arrivalTime', arrivalTime.toISOString());
  
    return this.http.get<Vehicle[]>(`${API_URL}/vehicles/available`, { headers: this.httpHeaders, params });
  }

  
}
