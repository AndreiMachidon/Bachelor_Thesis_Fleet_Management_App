import { Injectable } from '@angular/core';
import { CountryElectricityPrice } from '../util/country-electricity-price.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/contants';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ElectricityPricesService {

  httpHeaders: HttpHeaders;

   //electricity prices for EU countries
   prices: CountryElectricityPrice[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)

      this.getAllCountryElectricityPrices().subscribe(prices => {
        this.prices = prices;
      });
  }

  getAllCountryElectricityPrices(): Observable<CountryElectricityPrice[]> {
    return this.http.get<CountryElectricityPrice[]>(`${API_URL}/electricity/prices`,{ 'headers': this.httpHeaders });
  }

  getCountryFromPlace(place): string {
    const addressComponents = place.addressComponents;
    const countryComponent = addressComponents.find(component => component.types.includes("country"));
    return countryComponent ? countryComponent.longText : null;
  }

  getAveragePriceByCountry(country: string): number | null {
    const priceInfo = this.prices.find(price => price.country === country);
    return priceInfo ? priceInfo.averagePricePerKwh : null;
  }
}
