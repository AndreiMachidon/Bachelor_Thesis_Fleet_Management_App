import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GOOGLE_MAPS_API_KEY } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  placesNearbySearchUrl : string = "https://places.googleapis.com/v1/places:searchNearby";

  constructor(private httpClient: HttpClient){}

  public getNearbyGasStations(request: any): Observable<any> {
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-Goog-Api-Key', GOOGLE_MAPS_API_KEY)
    .set('X-Goog-FieldMask', 'places.displayName,places.id,places.location,places.addressComponents,places.formattedAddress');
    return this.httpClient.post(this.placesNearbySearchUrl, request, { 'headers': httpHeaders});
  }

  public getNearbyChargingStations(request: any){
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Goog-Api-Key', GOOGLE_MAPS_API_KEY)
      .set('X-Goog-FieldMask', 'places.displayName,places.id,places.location,places.evChargeOptions,places.addressComponents,places.formattedAddress');
    return this.httpClient.post(this.placesNearbySearchUrl, request, { 'headers': httpHeaders});
  }

  public getNearbyLocationsForRestBreaks(request: any) {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Goog-Api-Key', GOOGLE_MAPS_API_KEY)
      .set('X-Goog-FieldMask', 'places.displayName,places.id,places.location,places.formattedAddress');
    return this.httpClient.post(this.placesNearbySearchUrl, request, { 'headers': httpHeaders});
  }
}
