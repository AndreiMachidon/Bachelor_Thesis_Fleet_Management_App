import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { API_URL } from 'src/app/contants';
import { DashboardCardsInfoDto } from '../dto/dashboard-cards-info-dto';
import { Observable } from 'rxjs';
import { DashboardFleetExpensesByCategoryDto } from '../dto/dashboard-fleex-expenses.dto';
import { DashboardFuelCostsByTypeDto } from '../dto/dashboard-fuel-costs.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
  }

  getDashboardCardsInfo(adminId: number) : Observable<DashboardCardsInfoDto> {
    return this.http.get<DashboardCardsInfoDto>(`${API_URL}/dashboard/cards?adminId=${adminId}`, { headers: this.httpHeaders });
  }

  getDashboardFleetExpensesByCategory(adminId: number) : Observable<DashboardFleetExpensesByCategoryDto> {
    return this.http.get<DashboardFleetExpensesByCategoryDto>(`${API_URL}/dashboard/fleet-expenses?adminId=${adminId}`, { headers: this.httpHeaders });
  }

  getDashboardFuelCostsByType(adminId: number) : Observable<DashboardFuelCostsByTypeDto> {
    return this.http.get<DashboardFuelCostsByTypeDto>(`${API_URL}/dashboard/fuel-expenses?adminId=${adminId}`, { headers: this.httpHeaders });
  }

}
