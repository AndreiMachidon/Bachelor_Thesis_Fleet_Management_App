import { Injectable } from '@angular/core';
import { CountryFuelPrices } from '../util/country-fuel-prices.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/contants';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FuelPricesService {

  httpHeaders: HttpHeaders;

   //fuel prices for each country
   prices: CountryFuelPrices[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { 
      const token = this.authService.getAuthToken();
      this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)

      this.getAllCountryElectricityPrices().subscribe(prices => {
        this.prices = prices;
      });
  }

  getAllCountryElectricityPrices(): Observable<CountryFuelPrices[]> {
    return this.http.get<CountryFuelPrices[]>(`${API_URL}/fuel/prices`,{ 'headers': this.httpHeaders });
  }

  getCountryFromPlace(place): string {
    const addressComponents = place.addressComponents;
    const countryComponent = addressComponents.find(component => component.types.includes("country"));
    return countryComponent ? countryComponent.longText : null;
  }

  getGasolinePrice(country: string): number | null {
    const priceInfo = this.prices.find(price => price.country === country);
    return priceInfo ? priceInfo.gasolinePrice : null;
  }

  getDieselPrice(country: string): number | null {
    const priceInfo = this.prices.find(price => price.country === country);
    return priceInfo ? priceInfo.dieselPrice : null;
  }

  getElectricityPrice(country: string): number | null { 
    const priceInfo = this.prices.find(price => price.country === country);
    return priceInfo ? priceInfo.electricityPrice : null;
  }
}
