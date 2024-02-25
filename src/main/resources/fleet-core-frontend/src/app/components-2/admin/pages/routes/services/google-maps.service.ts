import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { API_URL } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  placesNearbySearchUrl : string = "https://places.googleapis.com/v1/places:searchNearby";


  constructor(private httpClient: HttpClient){}

  public getNearbyGasStations(request: any): Observable<any> {
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-Goog-Api-Key', 'AIzaSyCbyhY3YjBZ4KfkY_aceUm408pDw7Dc290')
    .set('X-Goog-FieldMask', 'places.displayName,places.id,places.location,places.fuelOptions');
    return this.httpClient.post(this.placesNearbySearchUrl, request, { 'headers': httpHeaders});
  }

  public getNearbyChargingStations(request: any){
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Goog-Api-Key', 'AIzaSyCbyhY3YjBZ4KfkY_aceUm408pDw7Dc290')
      .set('X-Goog-FieldMask', 'places.displayName,places.id,places.location,places.evChargeOptions');
    return this.httpClient.post(this.placesNearbySearchUrl, request, { 'headers': httpHeaders});
  }
}
